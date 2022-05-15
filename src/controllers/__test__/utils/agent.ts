import SuperTest from 'supertest';
import Server from '../../../Server';

export default async (): Promise<SuperTest.SuperAgentTest> => {
  const serverClass = new Server();
  const app = await serverClass.initialize();
  return SuperTest.agent(app.listen());
};
