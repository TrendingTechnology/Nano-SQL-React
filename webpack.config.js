module.exports = {
    entry: './index.js',
    output: {
      filename: 'nano-sql-react.min.js',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: {
        "nano-sql": "nano-sql",
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
    },
  };