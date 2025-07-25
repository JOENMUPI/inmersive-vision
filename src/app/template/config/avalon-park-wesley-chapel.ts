import imgAvalon1095 from '@/../public/template/avalon/5_Planos/1095.png';
import imgAvalon1296 from '@/../public/template/avalon/5_Planos/1296.png';
import imgAvalon790 from '@/../public/template/avalon/5_Planos/790.png';
import imgAvalon855 from '@/../public/template/avalon/5_Planos/855.png';
import imgAvalon990 from '@/../public/template/avalon/5_Planos/990.png';
import imgAvalon2Mod from '@/../public/template/avalon/16_Imagenes/02_Modified.jpg';
import imgAvalon4Mod from '@/../public/template/avalon/16_Imagenes/04_Standar_view.jpg';
import imgAvalon1 from '@/../public/template/avalon/16_Imagenes/1.jpg';
import imgAvalon2 from '@/../public/template/avalon/16_Imagenes/2.jpg';
import imgAvalon3 from '@/../public/template/avalon/16_Imagenes/3.jpg';
import imgAvalon4 from '@/../public/template/avalon/16_Imagenes/4.png';
import imgAvalon5 from '@/../public/template/avalon/16_Imagenes/5.png';
import imgAvalon6 from '@/../public/template/avalon/16_Imagenes/6.jpg';
import imgAvalon7 from '@/../public/template/avalon/16_Imagenes/7.jpg';
import imgAvalon8 from '@/../public/template/avalon/16_Imagenes/8.jpg';
import imgAvalon9 from '@/../public/template/avalon/16_Imagenes/9.jpg';
import imgAvalon10 from '@/../public/template/avalon/16_Imagenes/10.png';
import imgAvalon11 from '@/../public/template/avalon/16_Imagenes/11.jpg';
import imgAvalon12 from '@/../public/template/avalon/16_Imagenes/12.jpg';
import imgAvalon13 from '@/../public/template/avalon/16_Imagenes/13.jpg';
import imgAvalon14 from '@/../public/template/avalon/16_Imagenes/14.jpg';
import imgAvalon15 from '@/../public/template/avalon/16_Imagenes/15.jpg';
import imgAvalon16 from '@/../public/template/avalon/16_Imagenes/16.jpg';
import { dataAllI } from "@/app/template/utils/interfaces";
import { templateFormList } from '@/server/modules/form/domain/enums';

export const configAvalonPark: dataAllI = {
  data1: {
    title: 'Avalon Park Wesley Chapel',
    bgImg: imgAvalon2Mod.src,
  },  

  data2: {
    title: 'About the project',
    text: 'Avalon Park Wesley Chapel is a 1,600-acre master-planned community in Pasco County, Florida, that blends small-town charm with urban conveniences. When complete it will include roughly 4,800 homes and more than 400,000 square feet of retail plus 100,000 square feet of office space, all arranged around parks, schools, and trails. The first urban phase, Downtown I, is now leasing and combines ground-floor stores with apartments above, allowing residents to live, learn, work, and play without leaving the neighborhood.'
  },

  data3: {
    bgImg: imgAvalon4Mod.src,
    units:[
      {
        title: 'Address',
        description: 'Address: 4424 Friendly Way, Wesley Chapel, FL 33543 (leasing office at 33613 FL-54)'
      }, {
        title: 'Developer',
        description: 'Avalon Park Group and sitEX Properties'
      }, {
        title: 'Architect',
        description: 'Baskervill (master plan)'
      }, {
        title: 'Interior Design',
        description: 'Not publicly disclosed'
      }, {
        title: 'Visualization',
        description: 'Immersive Vision'
      }, {
        title: 'Units',
        description: '40 apartments in Downtown I; about 4,800 residences in the full plan'
      }, {
        title: 'Floors',
        description: '30 stories'
      }, {
        title: 'Unit size range',
        description: '538 to 1,266 sq ft'
      }, {
        title: 'Delivery year for Downtown I',
        description: '2024'
      }
    ],
  },

  data4: {
    imgs: [
      imgAvalon1.src,
      imgAvalon2.src,
      imgAvalon3.src,
      imgAvalon4.src,
      imgAvalon5.src,
      imgAvalon6.src,
      imgAvalon7.src,
      imgAvalon8.src,
      imgAvalon9.src,
      imgAvalon10.src,
      imgAvalon11.src,
      imgAvalon12.src,
      imgAvalon13.src,
      imgAvalon14.src,
      imgAvalon15.src,
      imgAvalon16.src
    ],
  }, 

  data5: {
    title: 'Spaces',
    subTitle: 'Space | Units',
    units: [ 
      {
        title: 'UNIT 790',
        img: imgAvalon790.src,
        units: [
          {
            title: '1 Bedroom | 1 Bath', 
            description: ''
          }, {
            title: 'Approx. 790 sq ft interior', 
            description: ''
          }, {
            title: 'Open-plan living / dining area', 
            description: ''
          }, {
            title: 'L-shaped kitchen with breakfast bar', 
            description: ''
          }, {
            title: 'Walk-in closet off the bedroom', 
            description: ''
          }, {
            title: 'In-unit washer & dryer niche', 
            description: ''
          }, {
            title: 'Full bathroom with soaking tub', 
            description: ''
          }, {
            title: 'Wood-look flooring in living spaces, carpet in bedroom', 
            description: ''
          },
        ],
      }, {
        title: 'Unit 1095',
        img: imgAvalon1095.src,
        units: [
          {
            title: '2 Bedrooms | 2 Baths', 
            description: ''
          }, {
            title: 'Approx. 1,095 sq ft interior', 
            description: ''
          }, {
            title: 'Split-bedroom layout for maximum privacy', 
            description: ''
          }, {
            title: 'Central open-plan living room with seating zone', 
            description: ''
          }, {
            title: 'L-shaped kitchen with breakfast bar for two', 
            description: ''
          }, {
            title: 'Dedicated dining nook off the kitchen', 
            description: ''
          }, {
            title: 'Walk-in closet for each bedroom', 
            description: ''
          }, {
            title: 'Two full bathrooms, each with soaking tub/shower combo', 
            description: ''
          }, {
            title: 'In-unit laundry closet near the entry', 
            description: ''
          }, {
            title: 'Wood-look flooring in living areas, carpet in bedrooms', 
            description: ''
          },
        ],
      }, {
        title: 'Unit 1296',
        img: imgAvalon1296.src,
        units: [
          {
            title: '3 Bedrooms | 2 Baths', 
            description: ''
          }, {
            title: 'Approx. 1,296 sq ft interior', 
            description: ''
          }, {
            title: 'Split-bedroom design for added privacy', 
            description: ''
          }, {
            title: 'Open-concept living, dining, and kitchen core', 
            description: ''
          }, {
            title: 'L-shaped kitchen with breakfast bar and pantry niche', 
            description: ''
          }, {
            title: 'Dedicated dining area comfortably seats six', 
            description: ''
          }, {
            title: 'Walk-in closets for each bedroom', 
            description: ''
          }, {
            title: 'Two full baths, each with tub/shower combo', 
            description: ''
          }, {
            title: 'In-unit laundry closet near kitchen entry', 
            description: ''
          }, {
            title: 'Wood-look flooring in common areas, carpet in bedrooms', 
            description: ''
          },
        ],
      }, {
        title: 'Unit 855',
        img: imgAvalon855.src,
        units: [
          {
            title: '1 Bedroom | 1 Bath', 
            description: ''
          }, {
            title: 'Approx. 855 sq ft interior + private balcony', 
            description: ''
          }, {
            title: 'Open living/dining space ideal for entertaining', 
            description: ''
          }, {
            title: 'L-shaped kitchen with breakfast bar for three', 
            description: ''
          }, {
            title: 'Walk-in closet directly off the bedroom', 
            description: ''
          }, {
            title: 'Full bathroom with soaking tub/shower combo', 
            description: ''
          }, {
            title: 'In-unit washer/dryer closet near kitchen', 
            description: ''
          }, {
            title: 'Wood-look flooring in common areas, carpet in bedroom', 
            description: ''
          }, {
            title: 'Large windows and sliding door provide abundant natural light', 
            description: ''
          }
        ],
      }, {
        title: 'Unit 990',
        img: imgAvalon990.src,
        units: [
          {
            title: '2 Bedrooms | 1 Bath', 
            description: ''
          }, {
            title: 'Approx. 990 sq ft interior + private balcony', 
            description: ''
          }, {
            title: 'Open living/dining area with L-shaped kitchen and breakfast bar', 
            description: ''
          }, {
            title: 'Walk-in closet for each bedroom', 
            description: ''
          }, {
            title: 'Full bathroom with soaking tub/shower combo', 
            description: ''
          }, {
            title: 'In-unit washer & dryer closet near kitchen', 
            description: ''
          }, {
            title: 'Wood-look flooring in common spaces, carpet in bedrooms', 
            description: ''
          }, {
            title: 'Large windows provide abundant natural light', 
            description: ''
          }
        ],
      } 
    ]   
  },

  data6: {
    title: 'Immersive Experience',
    url: '//storage.net-fs.com/hosting/7379150/14/',
  },

  data7: {
    title: 'Frequently Asked Questions',
    description: "Get quick answers to the most common questions about our AI solutions, services, and technology. Whether you're exploring how Cleo",
    sections: [
      {
        title: 'Category 1',
        questions: [
          {
            question: 'Question 1',
            response: 'Response 1'
          }, {
            question: 'Question 2',
            response: 'Response 2'
          }, {
            question: 'Question 3',
            response: 'Response 3'
          }, {
            question: 'Question 4',
            response: 'Response 4'
          }, {
            question: 'Question 5',
            response: 'Response 5'
          }
        ]
      }, {
        title: 'Category 2',
        questions: [
          {
            question: 'Question 1',
            response: 'Response 1'
          }, {
            question: 'Question 2',
            response: 'Response 2'
          }, {
            question: 'Question 3',
            response: 'Response 3'
          }, {
            question: 'Question 4',
            response: 'Response 4'
          }, {
            question: 'Question 5',
            response: 'Response 5'
          }
        ]
      }, {
        title: 'Category 3',
        questions: [
          {
            question: 'Question 1',
            response: 'Response 1'
          }, {
            question: 'Question 2',
            response: 'Response 2'
          }, {
            question: 'Question 3',
            response: 'Response 3'
          }, {
            question: 'Question 4',
            response: 'Response 4'
          }, {
            question: 'Question 5',
            response: 'Response 5'
          }
        ]
      }
    ]
  },

  data8: {
    title: 'Contact Form',
    call: 'Making a diference is our mission this is',
    companyName: 'Immersive Vision',
    terms: "I agree to be contacted via call, email, and text. To opt-out, you can reply 'stop' at any time or click the unsubscribe link in the emails. Message and data rates may apply. For more information see our Terms of Service and Privacy Policy. Data will not be sold or shared for marketing or promotional purposes.",
    beds: [],
    templateId: templateFormList.TEST,
    purchase: [],
  },

  data9: []
}
