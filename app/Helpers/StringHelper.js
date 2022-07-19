class StringHelper {

  static padLeft(num, chr) {
    const rest = 7 - num.toString().length;
    let pads = '';
    for (let i = 0; i < rest; i++) {
      pads += '' + chr;
    }
    return pads + '' + num;
  }
}


module.exports = StringHelper
