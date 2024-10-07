import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    commonjs({
      include: /node_modules/
    })
  ]
};