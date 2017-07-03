var fs = require('fs'),
    path = require('path'),
    COMMENT_KEY = /_comment$/;

require('child_process').execSync('npm install xcode@0.9.1');

module.exports = function (context) {
    var projectRoot = context.opts.projectRoot,
        xcodeProjectPath = fs.readdirSync(projectRoot).filter(function (file) { return ~file.indexOf('.xcodeproj') && fs.statSync(path.join(projectRoot, file)).isDirectory(); })[0],
        pbxprojPath = path.join(xcodeProjectPath, 'project.pbxproj');

    var xcodeProject = require('xcode').project(pbxprojPath);
    xcodeProject.parseSync();
    var buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();
    for (configName in buildConfigs) {
        if (!COMMENT_KEY.test(configName)) {
            var buildConfig = buildConfigs[configName];
            xcodeProject.updateBuildProperty('SWIFT_VERSION', '2.3', buildConfig.name);
        }
    }
    fs.writeFileSync(pbxprojPath, xcodeProject.writeSync());
}
