module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "http": require.resolve("stream-http"),
        "https": false,
        "buffer": require.resolve("buffer/"),
        "zlib": require.resolve("browserify-zlib") ,
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "url": require.resolve("url/"),
        "util": require.resolve("util/"),
        "crypto": require.resolve("crypto-browserify"),
        "querystring": require.resolve("querystcdring-es3"),
        "process": require.resolve("process"),
        "vm": require.resolve("vm-browserify")
    }

    return config
}
