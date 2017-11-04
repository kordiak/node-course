const {CheckIfExist, RESULT} = require('./mongoose-queries');
const expect = require('expect')

describe('Check how find wokrs with user')
{

  it('Should returns null when there is not such object in db',(done)=>
  {
    const id = '89f6086794501d369f16331c'

    CheckIfExist(id).then((fromMethod)=>
    {
      var a ={}

      expect(a).toBeA('null');
        done();
    }).catch((e)=>
    {
      expect(e).toBe(RESULT.NOTFOUND);
      done();
    });
  });

}
