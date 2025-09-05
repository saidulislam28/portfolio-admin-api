// this function removes the dash and capitalize the first letter of each Word, but if ther is no dash it will make the first letter uppercase and if user pass an empty string it will return empty string;

  export const formatServiceName = (serviceName:string) => {
    // Check if the service name is an empty string
    if (!serviceName) {
        return "";
      }
  
    // Check if the service name is a single lowercase word
    if (/^[a-z]+$/.test(serviceName)) {
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }
  
    // Check if the service name contains a dash
    if (serviceName.includes('-')) {
      // Replace dashes with spaces
      let formattedName = serviceName.replace(/-/g, ' ');
  
      // Capitalize the first letter of each word
      formattedName = formattedName.replace(/\b\w/g, (match) => match.toUpperCase());
  
      return formattedName;
    } else {
      // If there's no dash, return the original name
      return serviceName;
    }
  };