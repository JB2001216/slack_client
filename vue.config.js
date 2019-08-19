module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
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
          target: 'dmg',
          category: 'public.app-category.business',
          icon: 'build/icon.ico',
        },
        linux: {
          target: 'rpm',
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
      },
    },
  },
};
