export const formatMusicList = (str: string): string => {
    if (str === undefined || str === null) return "";

    const music_types = str?.split(",");
    let ret = "";
    music_types.map((item, i, arr) => {
        if (arr.length - 1 === i) {
            ret += ` ${item}`;
        } else if (i === 0) {
            ret += `${item} •`;
        } else {
            ret += ` ${item} •`;
        }
    });
    return ret;
};

export const removeEmptyKeys = (obj: any) => {
    Object.keys(obj).forEach(
        (key) =>
            obj[key] === null ||
            obj[key] === undefined ||
            (obj[key] === "" && delete obj[key])
    );
    return obj;
};

export const getTimeSlots = () => {
    var timeArray = [];
    var startTime = new Date();
    startTime.setHours(7, 0, 0, 0); // Set the start time to 7:00 AM

    var endTime = new Date();
    endTime.setHours(21, 0, 0, 0); // Set the end time to 9:00 PM

    var currentTime = startTime;

    while (currentTime <= endTime) {
        var formattedTime = currentTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

        timeArray.push(formattedTime.toLowerCase()); // Add the formatted time to the array
        currentTime.setMinutes(currentTime.getMinutes() + 15); // Increment time by 15 minutes
    }

    return timeArray;
};

/**
 * get days & hours array from query string in this format: Monday_morning|Monday_afternoon|Tuesday_evening
 */
export const getDaysAndHours = (queryStr) => {
    if (queryStr === undefined || queryStr === null || queryStr === "") {
        return { days: [], hours: [] };
    }
    const arr = queryStr.split("|");
    const all_days = arr.map((item) => item.split("_")[0]);
    const unique_days = all_days.filter(
        (day, index, currentVal) => currentVal.indexOf(day) === index
    );

    return { days: unique_days, hours: arr };
};

export const setStarRating = (totalRating: number, reviewCount: number) => {
    const avgRating = Math.floor(totalRating / reviewCount);

    if (isNaN(avgRating)) return 0;

    return avgRating;
};

export const getUniqueItemsByKey = (arr, key) => {
    const uniqueMap = new Map(); // Create a map to store unique items

    for (const item of arr) {
        const keyValue = item[key]; // Get the value of the specified key
        if (!uniqueMap.has(keyValue)) {
            uniqueMap.set(keyValue, item); // Add the item to the map if it's not already present
        }
    }

    return Array.from(uniqueMap.values()); // Convert the map back to an array of unique items
};

export const formatMySQLDateTimeToHumanFriendly = (mysqlDateTime) => {
    const date = new Date(mysqlDateTime);

    const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    return date.toLocaleString("en-US", options);
};

export const convertMySQLDateTimeToISO = (mysqlDateTime) => {
    const [datePart, timePart] = mysqlDateTime.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");

    // Create an ISO-formatted date-time string
    const isoDateTime = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;

    return isoDateTime;
};

// "2017-04-01"

export const getCurrentDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const getSelectedDateTime = (
    type: string = "date" || "time",
    selectedDate: Date
) => {
    // selectedDates are in ISO formats , new Date()
    // type parameter is a string

    const TYPE_DATE = "date";
    const TYPE_TIME = "time";

    if (type === TYPE_DATE) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(selectedDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    } else if (type === TYPE_TIME) {
        const hour = selectedDate.getHours();
        const minute = selectedDate.getMinutes();

        return `${hour}:${minute}`; // returns 24 hours format ex: 14:28
    }
};

export const back = () => window.history.back();

export const extractCityName = (cityString: string) => {
    // Check if the string contains a comma
    if (cityString.includes(",")) {
        // Split the string at the comma and trim any extra spaces
        const [cityName] = cityString.split(",").map((part) => part.trim());
        return cityName;
    } else {
        // If there's no comma, just return the original string
        return cityString;
    }
};

export const formatDateInString = (date) => {
    const originalDate = new Date("2024-01-27T00:00:00.000Z");
    // const formattedDate = `${originalDate.getDate()}-${originalDate.getMonth() + 1}-${originalDate.getFullYear()}`;
    const formattedDate = `${originalDate.getFullYear()}-${
        originalDate.getMonth() + 1
    }-${originalDate.getDate()}`;
    const formattedDateWithZeroPadding = formattedDate
        .split("-")
        .map((part) => part.padStart(2, "0"))
        .join("-");
    return formattedDateWithZeroPadding;
};

export const checkBoxTreeConverterData = (data) => {
    const treeData = [];
    const idMap = {};

    data.forEach((item) => {
        idMap[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
        if (item.parentId === null) {
            treeData.push(idMap[item.id]);
        } else {
            idMap[item.parentId].children.push(idMap[item.id]);
        }
    });

    return treeData;
};

export const convertToNestedTree = (categories, parentId = null, depth = 1) => {
    const result = [];

    if (categories) {
        for (const category of categories) {
            if (category.parent_id === parentId) {
                const child = {
                    id: category.id,
                    name: category.name,
                    slug: category?.slug,
                    isLeaf: depth >= 3 ? true : false,
                    children: [],
                };

                if (depth < 3) {
                    const grandchildren = convertToNestedTree(
                        categories,
                        category.id,
                        depth + 1
                    );
                    if (grandchildren.length > 0) {
                        child.children = grandchildren;
                    }
                }

                result.push(child);
            }
        }
    }

    return result;
};

export const dateFormatting = (date) => {
    const originalDate = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return originalDate.toLocaleDateString("en-US", options);
};

export const sortingMeta = (meta) => {
    if (meta) {
        meta.sort((a, b) => a?.sort_order - b?.sort_order);
    }
    return meta;
};

export const formatDateString = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export function convertTextFormat(inputText: string): string {
    return inputText
        ?.replace(/[_\-\/]/g, " ")
        ?.toLowerCase()
        ?.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function convertTreeArray(
    data = [],
    parentId = null,
    level = 1,
    maxLevel = 3
) {
    const result = [];

    for (let item of data) {
        if (item?.parent_id === parentId) {
            const node: any = {
                id: item?.id,
                name: item?.name,
                slug: item?.slug,
            };

            if (level < maxLevel) {
                const children = convertTreeArray(
                    data,
                    item?.id,
                    level + 1,
                    maxLevel
                );
                if (children?.length > 0) {
                    node.children = children;
                }
            }

            result.push(node);
        } else if (level === maxLevel) {
            for (let parentNode of result) {
                if (parentNode?.children) {
                    for (let child of parentNode?.children) {
                        if (child?.id === item?.id) {
                            if (!child?.children) {
                                child.children = [];
                            }
                            child?.children.push({
                                id: item?.id,
                                name: item?.name,
                                slug: item?.slug,
                            });
                        }
                    }
                }
            }
        }
    }

    return result;
}


export const componentTypes = {
    fullWidthBanner: 'FULL_WIDTH_BANNER',
    multipleColumnBanner: 'MULTIPLE_COLUMN_BANNER',
    categorySection: 'CATEGORY_SECTION',
    productCollectionSection: 'PRODUCT_COLLECTION_SECTION',
    customCollection: 'CUSTOM_COLLECTION',
    iconGroup: 'ICON_GROUP',
    fullSliderSection: 'FULL_SLIDER_SECTION',
};


export const extractCloudinaryPublicId = (url) => {
    // Validate input
    if (!url || typeof url !== 'string') {
      return '';
    }

    // Regex pattern to match Cloudinary URL structure
    const cloudinaryUrlPattern = /\/v\d+\/([^.]+)\.\w+$/;

    try {
      // Match the public ID in the URL
      const match = url.match(cloudinaryUrlPattern);

      if (!match) {
        return '';
      }

      // Return the captured group (public ID)
      return match[1];
    } catch (error) {
      console.error('Error extracting Cloudinary public ID:', error);
      throw error;
    }
  }


  export function convertSlugToNam(input = "") {
    return input
      .split("-") // Split the string by hyphens
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join the words with spaces
  }
