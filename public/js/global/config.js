/**
 * 配置文件
 * @param name
 * @returns {{jsencrypt: {password: string, validate: string}}|null}
 */
function config(name) {
    var config = {
        jsencrypt: {
            // 登录密码
            password: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMTZimBeTDsOet16YL6Oh9m1XW30EAl0KcfWZGf3LM+h7SVXEFAxdLaHWhvbTTryzObQdmk6QsJ3fgQBcU/5PUaXhNyS8tVASWk0OAf2CBZf/3Xn+v9RdeZMiq1xYEx0Np5CPQ8zhBWA75N5mXAqf7yVAgr40en/LuHYVfRmpafwIDAQAB',
            // 验证
            validate: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC11KaL9091czNYAcIv2BDu64+JLvP7MSR6v6/ExDEsGZmf2fdwxqExZprxSsnOTY2Xw2CVWFrieGErcjVumzZQjlRkKHjtrn2yCPjj05d9JKwfhDpghwEm5V7XH8kqneKv8tQ7apW+VFyesKEi0L5Smb2WM3I3bnHLozUyUmGgWwIDAQAB'
        }
    };
    if (typeof name == 'undefined' || name === '') {
        return config;
    }
    return config.hasOwnProperty(name) ? config[name] : null;
};