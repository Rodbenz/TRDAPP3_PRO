import "dayjs/locale/th";
import Dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
Dayjs.extend(buddhistEra);

export default class OverwriteAdapterDayjs extends AdapterDayjs {
  constructor({ locale, formats, instance }) {
    super({ locale, formats, instance });
  }
  formatByString = (date, format) => {
      if (format === "YYYY") {
        format = "BBBB";
      }
      return this.dayjs(date).format(format);
   }
}




