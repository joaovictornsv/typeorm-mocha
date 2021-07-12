import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import connection from './ormconfig';

const options = connection as ConnectionOptions;

export default async (): Promise<Connection> => createConnection(options);
