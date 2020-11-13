const KrellKollection = artifacts.require('./KrellKollection.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('KrellKollection', ([deployer, uploader]) => {
  let krellKollection

  before(async () => {
    krellKollection = await KrellKollection.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await krellKollection.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await krellKollection.name()
      assert.equal(name, 'KrellKollection')
    })
  })

  describe('file', async () => {
    let result, fileCount
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'TypeOfTheFile'
    const fileName = 'NameOfTheFile'
    const fileDescription = 'DescriptionOfTheFile'

    before(async () => {
      result = await krellKollection.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await krellKollection.fileCount()
    })

    //check event
    it('upload file', async () => {
      // SUCESS
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id is correct')
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.fileDescription, fileDescription, 'Description is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')

      // FAILURE: File must have hash
      await krellKollection.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have size
      await krellKollection.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;
      
      // FAILURE: File must have type
      await krellKollection.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have name
      await krellKollection.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be.rejected;

      // FAILURE: File must have description
      await krellKollection.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })

    //check from Struct
    it('lists file', async () => {
      const file = await krellKollection.files(fileCount)
      assert.equal(file.fileId.toNumber(), fileCount.toNumber(), 'id is correct')
      assert.equal(file.fileHash, fileHash, 'Hash is correct')
      assert.equal(file.fileSize, fileSize, 'Size is correct')
      assert.equal(file.fileName, fileName, 'Size is correct')
      assert.equal(file.fileDescription, fileDescription, 'description is correct')
      assert.equal(file.uploader, uploader, 'uploader is correct')
    })
  })
})