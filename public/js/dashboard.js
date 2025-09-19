document.addEventListener('DOMContentLoaded', function() {
  const playerForm = document.getElementById('player-form');
  const playersTable = document.getElementById('players-data');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const formTitle = document.getElementById('form-title');
  const playerCount = document.getElementById('player-count');
  let editingId = null;

  // Load user info and initial data
  loadUserInfo();
  fetchPlayers();

  // Load current user information
  async function loadUserInfo() {
    try {
      const response = await fetch('/user');
      if (response.ok) {
        const user = await response.json();
        document.getElementById('username').textContent = user.username;
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error loading user info:', error);
      window.location.href = '/login';
    }
  }

  // Fetch and display players for current user
  async function fetchPlayers() {
    try {
      const response = await fetch('/players');
      if (response.ok) {
        const players = await response.json();
        displayPlayers(players);
      } else if (response.status === 401) {
        window.location.href = '/login';
      } else {
        console.error('Error fetching players:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  }

  // Display players in the table
  function displayPlayers(players) {
    playersTable.innerHTML = '';
    
    // Update player count
    playerCount.textContent = `${players.length} player${players.length !== 1 ? 's' : ''}`;
    
    if (players.length === 0) {
      playersTable.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted py-4">
            <i class="bi bi-inbox display-4"></i>
            <p class="mt-2">No players added yet. Add your first player using the form!</p>
          </td>
        </tr>
      `;
      return;
    }
    
    players.forEach(player => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-primary"></i>
            <strong>${escapeHtml(player.name)}</strong>
          </div>
        </td>
        <td>
          <span class="position-badge">${escapeHtml(player.position)}</span>
        </td>
        <td>
          <span class="stats-badge">${player.avg.toFixed(3)}</span>
        </td>
        <td>
          <span class="stats-badge">${player.obp.toFixed(3)}</span>
        </td>
        <td>
          <span class="stats-badge">${player.slg.toFixed(3)}</span>
        </td>
        <td>
          <span class="stats-badge">${player.ops.toFixed(3)}</span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-warning edit-btn" data-id="${player._id}" title="Edit Player">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger delete-btn" data-id="${player._id}" title="Delete Player">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      playersTable.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        editPlayer(id, players);
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const player = players.find(p => p._id === id);
        deletePlayer(id, player ? player.name : 'this player');
      });
    });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Handle form submission (add or update player)
  playerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const playerId = document.getElementById('player-id').value;
    const playerData = {
      name: document.getElementById('name').value.trim(),
      position: document.getElementById('position').value,
      avg: parseFloat(document.getElementById('avg').value),
      obp: parseFloat(document.getElementById('obp').value),
      slg: parseFloat(document.getElementById('slg').value)
    };
    
    // Basic validation
    if (!playerData.name) {
      alert('Please enter a player name');
      return;
    }
    
    if (!playerData.position) {
      alert('Please select a position');
      return;
    }
    
    if (isNaN(playerData.avg) || isNaN(playerData.obp) || isNaN(playerData.slg)) {
      alert('Please enter valid numbers for all statistics');
      return;
    }
    
    try {
      let response;
      if (playerId) {
        // Update existing player
        response = await fetch(`/players/${playerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(playerData)
        });
      } else {
        // Add new player
        response = await fetch('/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(playerData)
        });
      }
      
      if (response.ok) {
        const players = await response.json();
        displayPlayers(players);
        resetForm();
        
        // Show success message
        showToast(playerId ? 'Player updated successfully!' : 'Player added successfully!', 'success');
      } else if (response.status === 401) {
        window.location.href = '/login';
      } else {
        throw new Error('Failed to save player');
      }
    } catch (error) {
      console.error('Error saving player:', error);
      showToast('Error saving player. Please try again.', 'error');
    }
  });

  // Edit player
  function editPlayer(id, players) {
    const player = players.find(p => p._id === id);
    if (player) {
      document.getElementById('player-id').value = player._id;
      document.getElementById('name').value = player.name;
      document.getElementById('position').value = player.position;
      document.getElementById('avg').value = player.avg;
      document.getElementById('obp').value = player.obp;
      document.getElementById('slg').value = player.slg;
      
      formTitle.innerHTML = '<i class="bi bi-pencil me-2"></i>Edit Player';
      submitBtn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Update Player';
      cancelBtn.style.display = 'inline-block';
      editingId = id;
      
      // Scroll to form
      document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Delete player
  async function deletePlayer(id, playerName) {
    if (confirm(`Are you sure you want to delete ${playerName}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/players/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          const players = await response.json();
          displayPlayers(players);
          
          if (editingId === id) {
            resetForm();
          }
          
          showToast('Player deleted successfully!', 'success');
        } else if (response.status === 401) {
          window.location.href = '/login';
        } else {
          throw new Error('Failed to delete player');
        }
      } catch (error) {
        console.error('Error deleting player:', error);
        showToast('Error deleting player. Please try again.', 'error');
      }
    }
  }

  // Reset form to add mode
  function resetForm() {
    playerForm.reset();
    document.getElementById('player-id').value = '';
    formTitle.innerHTML = '<i class="bi bi-person-plus-fill me-2"></i>Add New Player';
    submitBtn.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Add Player';
    cancelBtn.style.display = 'none';
    editingId = null;
  }

  // Make resetForm available globally
  window.resetForm = resetForm;

  // Show toast notification
  function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
      toast.remove();
    });
  }

  // Create toast container if it doesn't exist
  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
  }

  // Logout function
  window.logout = async function() {
    if (confirm('Are you sure you want to logout?')) {
      try {
        const response = await fetch('/logout', {
          method: 'POST'
        });
        
        if (response.ok) {
          window.location.href = '/login';
        } else {
          throw new Error('Logout failed');
        }
      } catch (error) {
        console.error('Logout error:', error);
        // Force redirect even if logout request fails
        window.location.href = '/login';
      }
    }
  };
});