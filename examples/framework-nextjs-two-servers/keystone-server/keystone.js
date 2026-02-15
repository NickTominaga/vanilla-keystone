import { config } from '@keystone-6/core'
import { seedDatabase } from './src/seed'
import { lists } from './src/schema'

const db = {
  provider: 'sqlite',
  url: 'file:./database.db',
  async onConnect(context) {
    if (process.argv.includes('--seed-database')) {
      await seedDatabase(context)
    }
  },

  // WARNING: this is only needed for our monorepo examples, dont do this
  prismaClientPath: 'node_modules/myprisma',
}

export default config({
  db,
  lists,
})
