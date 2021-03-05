const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, '/src/styles')],
    },
    images: {
        domains: ["res.cloudinary.com"],
    },
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat'
            });
        }

        return config;
    }
}