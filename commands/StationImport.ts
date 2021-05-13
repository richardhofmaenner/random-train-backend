import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import * as fs from 'fs'
import path from 'path'
import * as csv from 'fast-csv'
import Station from 'App/Models/Station'

export default class StationImport extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'station:import'

  @args.string({ description: 'Path to the CSV file' })
  public file: string

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Import all stations from a csv file'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process
     */
    stayAlive: true,
  }

  public async run() {
    const regex = /^85[0-9]*$/
    fs.createReadStream(path.resolve(this.file))
      .pipe(csv.parse({ headers: true, delimiter: ',' }))
      .on('error', (error) => this.logger.error(error))
      .on('data', async (row) => {
        if (regex.exec(row.StationID) !== null) {
          const station = await Station.find(row.StationID)
          if (station === null) {
            const newStation = new Station()
            const splitStation = row.Station.split('$')
            newStation.id = row.StationID
            newStation.synonyms = ''
            for (let i = 0; splitStation.length > i; i = i + 2) {
              switch (splitStation[i + 1]) {
                case '<1>':
                  newStation.name = splitStation[i]
                  break
                case '<2>':
                  newStation.longName = splitStation[i]
                  break
                case '<3>':
                  newStation.abbreviation = splitStation[i]
                  break
                case '<4>':
                  newStation.synonyms += splitStation[i] + ' '
                  break
                default:
                  break
              }
            }
            await newStation.save()
          }
        }
      })
      .on('end', (rowCount: number) => this.logger.info(`Parsed ${rowCount} rows`))
  }
}
