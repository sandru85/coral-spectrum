/**
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

module.exports = function(gulp) {
  const KarmaServer = require('karma').Server;
  const configFile = `${__dirname}/../configs/karma.conf.js`;
  const PluginError = require('plugin-error');
  
  gulp.task('karma', function(done) {
    new KarmaServer({
      configFile: configFile,
      singleRun: true
    }, (err) => {
      if (err) {
        done(new PluginError('karma', 'Test failures'));
      }
      done();
    }).start();
  });
  
  gulp.task('karma-watch', function(done) {
    new KarmaServer({
      configFile: configFile
    }, done).start();
  });
};
