import type { IAccount, IRemoteAccount } from '@renderer/core/entities/account/i';

export async function findById(id: number): Promise<IRemoteAccount> {
  return {
    dataValues: {
      id,
      name: '',
      username: '',
      email: '',
      password: '',
      domain: '',
      hidden: false,
      favicon: '',
      createdAt: new Date(),
      updateAt: new Date()
    },
  };
}

export async function findAll(): Promise<Array<IRemoteAccount>> {
  return [];
}

export async function create(values: Partial<IAccount>): Promise<IRemoteAccount> {
  console.log('create', values);
  return findById(0);
}

export async function update(identifier: number, body: string): Promise<IRemoteAccount | null> {
  const values: Omit<IAccount, 'id'> = JSON.parse(body);
  console.log('update', identifier, values);

  return findById(0);
}

export async function destroy(identifier: number): Promise<boolean> {
  console.log('destroy', identifier);
  return false;
}
