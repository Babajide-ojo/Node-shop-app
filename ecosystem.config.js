module.exports = {
  apps: [
    {
      script: "server.js",
      watch: ".",
      instances: "MAX",
      autorestart: true,
      watch: true,
      exec_mode: "cluster",
      max_memory_restart: 3,
    }
  ]
};
