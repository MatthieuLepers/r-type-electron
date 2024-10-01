import { contextBridge } from 'electron';

import { sequelize } from '@/main/database';
import populate from '@/main/database/populate';
import api from '@/main/api';

contextBridge.exposeInMainWorld('api', api);

sequelize.sync()
  .then(async () => {
    await populate();
    api.sendSync('databaseReady');
  })
  .catch(console.log)
;
