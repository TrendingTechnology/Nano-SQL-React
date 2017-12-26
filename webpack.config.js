module.exports = {
    entry: './index.js',
    output: {
      filename: 'nano-sql-react.min.js',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: {
        "nano-sql": "nSQL",
        "react": "React"
    },
  };