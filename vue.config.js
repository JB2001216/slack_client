const builderOptions = {
  productName: 'erniepjm',
  appId: 'jp.co.ernie.pjm',
  protocols: [
    {
      name: 'Ernie',
      schemes: [
        'erniepjm',
      ],
    },
  ],
  mac: {
    target: ['dmg', 'zip'],
    category: 'public.app-category.business',
    icon: 'build/icon.ico',
  },
  linux: {
    target: 'appImage',
    category: 'ProjectManagement',
    icon: 'build/icon.ico',
  },
  win: {
    target: {
      target: 'nsis',
      arch: ['x64', 'ia32'],
    },
    icon: 'build/icon.ico',
  },
};

if (process.env.NODE_ENV === 'development') {
  Object.assign(builderOptions, {
    productName: 'erniepjm-dev',
    appId: 'jp.co.ernie.pjm-dev',
    protocols: [{
      name: 'Ernie(dev)',
      schemes: [
        'erniepjm',
      ],
    },
    ],
    publish: {
      provider: 's3',
      bucket: 'erniepjm-electron-pkg-dev',
      region: 'us-east-1',
    },
  });
}

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions,
    },
  },
};
