module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
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
          icon: 'build/icon.png',
        },
        linux: {
          target: 'rpm',
          category: 'ProjectManagement',
          icon: 'build/icon.png',
        },
        win: {
          target: {
            target: 'nsis',
            arch: ['x64', 'ia32'],
          },
          icon: 'build/icon.png',
        },
      },
    },
  },
};
