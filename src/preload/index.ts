import { contextBridge } from 'electron';

import { sequelize } from '@/main/database';
import api from '@/main/api';

contextBridge.exposeInMainWorld('api', api);

sequelize.sync()
  .catch(console.log)
;
