import moment from "moment-timezone";

const HelperData = {
  toCamel: (string) => {
    return string !== ""
      ? string.replace(/(?:_| |\b)(\w)/g, function ($1) {
          return $1.toUpperCase().replace("_", " ");
        })
      : string;
  },

  formatDate: (string) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const date = new Date(string);
    return date.toLocaleDateString(undefined, options);
  },

  capitalizeWords: (string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  truncate: (string, maxLength) => {
    if (string.length > maxLength) {
      return string.slice(0, maxLength) + "...";
    }
    return string;
  },
  userType: (type = "") => {
    let data = {
      1: "Student",
      2: "Professional",
      3: "Educational Institution",
      4: "Business",
      5: "Central Govt",
      6: "State Govt",
    };
    if (type) {
      return data[type];
    }
    return data;
  },
  IndividualType: (type = "") => {
    let data = {
      1: "Student",
      2: "Professional",
    };
    if (type) {
      return data[type];
    }
    return data;
  },
  OrganisationType: (type = "") => {
    let data = {
      3: "Educational Institution",
      4: "Business",
      5: "Central Govt",
      6: "State Govt",
    };
    if (type) {
      return data[type];
    }
    return data;
  },
  emailValid: (string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const isValidEmail = emailRegex.test(string);
    return isValidEmail;
  },
  mobileValid: (string) => {
    const emailRegex =
      /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[7-9]\d{2})(\s*[-]\s*)?\d{3}(\s*[-]\s*)?\d{4}$/;
    const isValidEmail = emailRegex.test(string);
    return isValidEmail;
  },
  passwordValid: (string) => {
    const emailRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.*[0-9a-zA-Z]).{8,}$/;
    const isValidEmail = emailRegex.test(string);
    return isValidEmail;
  },
  formatDateToISO: (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  },
  formatDateToDMMMYYYY: (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  },
  formatDateTime: (dateTime, format) => {
    dateTime = moment(dateTime);
    // Adjust the time zone if necessary
    dateTime?.utcOffset("+05:30");
    // Format the date and time
    if (format) return dateTime?.format(format);
    else return dateTime?.format("DD MMM YYYY, hh:mm A");
  },
  descriptionFormatter: (sentence) => {
    // Check if the sentence ends with a period
    if (sentence?.trim()?.endsWith(".")) {
      // If it does, return the original sentence
      return sentence;
    } else {
      // If it doesn't, add ellipsis (...) to the end and return
      return sentence?.trim() + "...";
    }
  },
  formatDateToYears: (dateString) => {
    let { start_date, end_date } = dateString;
    let inputDate = 0;
    let currentDate = 0;
    let diffYears = 0;
    if (start_date) {
      const [month, year] = start_date?.split("/");
      inputDate = new Date(parseInt(year), parseInt(month) - 1);
    } else {
      start_date = moment(Date.now()).format("MM/YYYY");
      const [month, year] = String(end_date)?.split("/");
      inputDate = new Date(parseInt(year), parseInt(month) - 1);
    }
    if (end_date) {
      const [month, year] = end_date?.split("/");
      currentDate = new Date(parseInt(year), parseInt(month) - 1);
    } else {
      end_date = moment(Date.now()).format("MM/YYYY");
      const [month, year] = String(end_date)?.split("/");
      currentDate = new Date(parseInt(year), parseInt(month) - 1);
    }
    diffYears = currentDate?.getFullYear() - inputDate?.getFullYear();
    return diffYears && diffYears != NaN ? diffYears : 0;
  },
  lastLoginFormat: (date_at) => {
    if(date_at){
      date_at = new Date(date_at);
      const today = moment(Date.now());
      const diff_day = today.diff(date_at,'day');
      return diff_day ? `${diff_day} day ago` : "0 day ago"

    } else return "0 day ago"
  },
  nameFormatter: ({name, outcome}) => {
    if(name) {
      let nameComponents = name.trim().split(' ');
      let lastName = nameComponents.pop();
      let firstName = nameComponents.join(' ');
      if(outcome == 'last') return lastName ?? "";
      else if(outcome == "first") return firstName ?? "";
      else return name ? {first: firstName, last: lastName} : {}
    }
  },
  stringFormatter: (string) => {
    if (string) string = string.toLowerCase();
    return string?.replace(/^\w/, (char) => char.toUpperCase());
  },
  expiredOrNot: (expired_at) => {
    if(expired_at) {
      let today = new Date();
      const expiredDate = new Date(expired_at);
      today = moment(Date.now());
      const diff_day = today.diff(expiredDate,'day');
      return  {expired: expiredDate < today, diff: `${diff_day} day ago`};
    }


    // Expired date

    // Check if expiredDate is before today
    const isExpired = expiredDate < today;
  }
};

export default HelperData;
