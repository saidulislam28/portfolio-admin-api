import Image from "next/image";
import Hr_Supervision from "./amenities/24_Hr_Supervision.svg";
import ADL_Assistance from "./amenities/ADL_Assistance.svg";
import Air_Conditioning from "./amenities/Air_Conditioning.svg";
import Ambulation_Assistance from "./amenities/Ambulation_Assistance.svg";
import Barber_Salon from "./amenities/Barber_Salon.svg";
import Bathing_Assistance from "./amenities/Bathing_Assistance.svg";
import Cable_Satelite_TV from "./amenities/Cable_Satelite_TV.svg";
import Cafe_or_Bistro from "./amenities/Cafe_or_Bistro.svg";
import Chapel from "./amenities/Chapel.svg";
import Dementia_Alzheimer from "./amenities/Dementia_Alzheimer.svg";
import Diabetes_Care from "./amenities/Diabetes_Care.svg";
import Diabetes_Diet from "./amenities/Diabetes_Diet.svg";
import Dining_Room from "./amenities/Dining_Room.svg";
import Family_Support_And_Education from "./amenities/Family_Support_And_Education.svg";
import Fitness_Center from "./amenities/Fitness_Center.svg";
import Free_Transportation from "./amenities/Free_Transportation.svg";
import Full_Kitchen from "./amenities/Full_Kitchen.svg";
import Furnished from "./amenities/Furnished.svg";
import Game_Room from "./amenities/Game_Room.svg";
import Garden from "./amenities/Garden.svg";
import Guest_Meals from "./amenities/Guest_Meals.svg";
import Handicap_Accessible from "./amenities/Handicap_Accessible.svg";
import Housekeeping from "./amenities/Housekeeping.svg";
import Incontinence_care from "./amenities/Incontinence_care.svg";
import International_Cuisine from "./amenities/International_Cuisine.svg";
import Kitchenette from "./amenities/Kitchenette.svg";
import Laundry_Service from "./amenities/Laundry_Service.svg";
import Library from "./amenities/Library.svg";
import Low_No_Sodium from "./amenities/Low_No_Sodium.svg";
import Meals_Provided from "./amenities/Meals_Provided.svg";
import Medication_Management from "./amenities/Medication_Management.svg";
import Movie_Room from "./amenities/Movie_Room.svg";
import Nutrition_And_Dining from "./amenities/Nutrition_And_Dining.svg";
import Personal_Care_Assistance from "./amenities/Personal_Care_Assistance.svg";
import Pets_Allowed from "./amenities/Pets_Allowed.svg";
import Physical_Occupational_Therapy from "./amenities/Physical_Occupational_Therapy.svg";
import Private_Bathroom from "./amenities/Private_Bathroom.svg";
import Private_Patio_Balcony from "./amenities/Private_Patio_Balcony.svg";
import Restaurant_Style_Dining from "./amenities/Restaurant_Style_Dining.svg";
import { default as Secure_Environment, default as Sensory_Environments } from "./amenities/Secure_Environment.svg";
import Spa_Wellness_Room from "./amenities/Spa_Wellness_Room.svg";
import Swimming_Pool from "./amenities/Swimming_Pool.svg";
import Vegan from "./amenities/Vegan.svg";
import Vegetarian from "./amenities/Vegetarian.svg";
import Washer_Dryer from "./amenities/Washer_Dryer.svg";
import Wifi from "./amenities/Wifi.svg";
import Hassle_Free_Living from "./amenities/Hassle_Free_Living.svg";
import Maintenance_Services from "./amenities/Maintenance_Services.svg";
import Dining_Experiences from "./amenities/Dining_Experiences.svg";
import Transportation_Services from "./amenities/Transportation_Services.svg";
import Safety_Accessibility from "./amenities/Safety_Accessibility.svg";
import Health_And_Wellness_Programs from "./amenities/Health_And_Wellness_Programs.svg";
import Social_And_Recreational_Opportunities from "./amenities/Social_And_Recreational_Opportunities.svg";
import Support_As_Needed from "./amenities/Support_As_Needed.svg";

const IMPORTS = {
    Hassle_Free_Living,
    Maintenance_Services,
    Dining_Experiences,
    Transportation_Services,
    Safety_Accessibility,
    Health_And_Wellness_Programs,
    Social_And_Recreational_Opportunities,
    Support_As_Needed,
    Secure_Environment,
    Sensory_Environments,
    Physical_Occupational_Therapy,
    Personal_Care_Assistance,
    Family_Support_And_Education,
    Nutrition_And_Dining,
    Washer_Dryer,
    Vegetarian,
    Vegan,
    Swimming_Pool,
    Spa_Wellness_Room,
    Private_Patio_Balcony,
    Restaurant_Style_Dining,
    Private_Bathroom,
    Pets_Allowed,
    Movie_Room,
    Medication_Management,
    Meals_Provided,
    Low_No_Sodium,
    Library,
    Laundry_Service,
    Kitchenette,
    International_Cuisine,
    Incontinence_care,
    Housekeeping,
    Handicap_Accessible,
    Guest_Meals,
    Garden,
    Game_Room,
    Furnished,
    Wifi,
    Full_Kitchen,
    Hr_Supervision,
    ADL_Assistance,
    Air_Conditioning,
    Ambulation_Assistance,
    Barber_Salon,
    Bathing_Assistance,
    Cable_Satelite_TV,
    Cafe_or_Bistro,
    Chapel,
    Dementia_Alzheimer,
    Diabetes_Care,
    Diabetes_Diet,
    Dining_Room,
    Fitness_Center,
    Free_Transportation,
}

const AmenityIcon = ({ name, className, ...props }) => {
    return (
        <img
            className={className ? className : ''}
            priority
            src={IMPORTS[name]}
            alt=""
        />
    )
    /*const importAll = (r) => {
        return r.keys().reduce((acc, fileName) => {
            const iconName = fileName.replace('./', '').replace('.svg', '');
            acc[iconName] = r(fileName).default;
            return acc;
        }, {});
    };

    const icons = importAll(require.context('../public/icons', false, /\.svg$/));

    if (icons[name]) {
        const SvgComponent = icons[name];
        return <SvgComponent {...props} />;
    } else {
        return null;
    }*/
};

export default AmenityIcon;
