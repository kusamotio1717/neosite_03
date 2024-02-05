import esbuild from 'esbuild';

const context = await esbuild.context({
  entryPoints: ['./src/js/app.ts'],
  bundle: true,
  outfile: 'wp/wp-content/themes/●●●/js/app.js',
  minify: true,
  target: ['es2020'],
  platform: 'node',
  // loader: {
  //   '.tsx': 'tsx',
  //   '.ts': 'ts'
  // },
  // sourcemap: true,
  // plugins: [inlineImage()],
});

// Enable watch mode
await context.watch();
