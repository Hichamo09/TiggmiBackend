const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);


module.exports = {
  updateStatus: (req, res) => {
    let { idOut, value } = req.query
    fs.writeFile(`${appDir}/${idOut}.txt`, value, function (err) {
      if (err) return res.json({success: false, message: 'internal error'});
      res.json({success: true});
    });
  }
}
