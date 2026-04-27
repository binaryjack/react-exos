export const chatService = {
  connect(roomId) {
    console.log(`✅ Connected to room: ${roomId}`);
    // This mock returns a disconnect function
    return () => {
      console.log(`❌ Disconnected from room: ${roomId}`);
    };
  },
  
  /**
   * Fetches welcome messages for a specific room.
   * @param {string} roomId 
   * @returns {Promise<string[]>}
   */
  async getWelcomeMessages(roomId) {
    const messages = {
      music: [
        "Welcome to the Music Room! 🎸",
        "Share your favorite tracks and discuss latest hits."
      ],
      general: [
        "Welcome to the General Room! 👋",
        "A place for everyone to chat about anything."
      ],
      travel: [
        "Welcome to the Travel Room! ✈️",
        "Plan your next adventure or share past trips."
      ]
    };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(messages[roomId] || ["Welcome!", "Enjoy your stay."]);
      }, 600);
    });
  }
};
