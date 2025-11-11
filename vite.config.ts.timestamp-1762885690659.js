var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// vite.config.ts
var { defineConfig } = __require("vite");
var react = __require("@vitejs/plugin-react");
var path = __require("path");
module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("C:\\Users\\pollyana.rocha\\Downloads\\Projetos\\PIT-CupCake-2025", "./")
    }
  },
  define: {
    "process.env": {}
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  base: "./"
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIHZpdGUuY29uZmlnLnRzXG5jb25zdCB7IGRlZmluZUNvbmZpZyB9ID0gcmVxdWlyZSgndml0ZScpO1xuY29uc3QgcmVhY3QgPSByZXF1aXJlKCdAdml0ZWpzL3BsdWdpbi1yZWFjdCcpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShcIkM6XFxcXFVzZXJzXFxcXHBvbGx5YW5hLnJvY2hhXFxcXERvd25sb2Fkc1xcXFxQcm9qZXRvc1xcXFxQSVQtQ3VwQ2FrZS0yMDI1XCIsIFwiLi9cIiksXG4gICAgfSxcbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Jzoge31cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBlbXB0eU91dERpcjogdHJ1ZVxuICB9LFxuICBiYXNlOiAnLi8nXG59KTsiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7QUFDQSxJQUFNLEVBQUUsYUFBYSxJQUFJLFVBQVE7QUFDakMsSUFBTSxRQUFRLFVBQVE7QUFDdEIsSUFBTSxPQUFPLFVBQVE7QUFFckIsT0FBTyxVQUFVLGFBQWE7QUFBQSxFQUM1QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsb0VBQW9FLElBQUk7QUFBQSxJQUM1RjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsRUFDZjtBQUFBLEVBQ0EsTUFBTTtBQUNSLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
