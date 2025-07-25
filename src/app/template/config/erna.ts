import imgErnaPlano from '@/../public/template/erna/1_plano/Floor_plans_erna_both.png';
import imgErna1 from '@/../public/template/erna/16_imagenes/1.png';
import imgErna2 from '@/../public/template/erna/16_imagenes/2.png';
import imgErna3 from '@/../public/template/erna/16_imagenes/3.png';
import imgErna4 from '@/../public/template/erna/16_imagenes/4.png';
import imgErna5 from '@/../public/template/erna/16_imagenes/5.png';
import imgErna6 from '@/../public/template/erna/16_imagenes/6.png';
import imgErna7 from '@/../public/template/erna/16_imagenes/7.png';
import imgErna8 from '@/../public/template/erna/16_imagenes/8.png';
import imgErna9 from '@/../public/template/erna/16_imagenes/9.jpg';
import imgErna10 from '@/../public/template/erna/16_imagenes/10.png';
import imgErna11 from '@/../public/template/erna/16_imagenes/11.png';
import imgErna12 from '@/../public/template/erna/16_imagenes/12PRO.png';
import imgErna13 from '@/../public/template/erna/16_imagenes/13PRO.png';
import imgErna14 from '@/../public/template/erna/16_imagenes/14PRO.png';
import imgErna15 from '@/../public/template/erna/16_imagenes/15PRO.png';
import imgErna16 from '@/../public/template/erna/16_imagenes/16PRO.png';
import { dataAllI } from "@/app/template/utils/interfaces";

export const configErna: dataAllI = {
  data1: {
    title: '2510 Erna',
    bgImg: imgErna1.src,
  },  

  data2: {
    title: 'About the project',
    text: '2510 | Modern Coastal Residence, Tampa FL With 2,510 sq ft of chic indoor living and seamless outdoor flow, 2510 reimagines Florida living through crisp cubic volumes, warm wood accents and impact-rated glazing. Two primary suites frame the plan—one on each level—while a double-height great room opens to a resort-style pool deck. Designed by RIOS Architecture Inc., visualized by Immersive Vision and styled by Ana Studio, the home is built by MVI Modern Homes to deliver a turn-key blend of sophistication and everyday ease.'
  },

  data3: {
    bgImg: imgErna2.src,
    units:[
      {
        title: 'Location',
        description: 'Tampa, Florida (suburban infill lot)v'
      }, {
        title: 'Architect',
        description: 'RIOS Architecture Inc.'
      }, {
        title: 'Interior Design',
        description: 'Ana Studio'
      }, {
        title: 'Visualization',
        description: 'Immersive Vision'
      }, {
        title: 'Builder',
        description: 'MVI Modern Homes'
      }, {
        title: 'Living Area',
        description: '2,510 sq ft conditioned'
      }, {
        title: 'Layout',
        description: '3 bedrooms · 3.5 baths · 2 living lounges · 2 balconies · 2-car garage'
      }, {
        title: 'Outdoor',
        description: 'Covered back porch, sun deck & salt-water pool'
      }
    ],
  },

  data4: {
    imgs: [
      imgErna1.src,
      imgErna2.src,
      imgErna3.src,
      imgErna4.src,
      imgErna5.src,
      imgErna6.src,
      imgErna7.src,
      imgErna8.src,
      imgErna9.src,
      imgErna10.src,
      imgErna11.src,
      imgErna12.src,
      imgErna13.src,
      imgErna14.src,
      imgErna15.src,
      imgErna16.src
    ],
  }, 

  data5: {
    title: 'Spaces',
    subTitle: 'Space | Units',
    units: [ 
      {
        title: 'Floor plan',
        img: imgErnaPlano.src,
        units: [
          {
            title: 'Two true primary suites (one per floor) + flexible guest bedroom', 
            description: ''
          }, {
            title: '3.5 spa-inspired bathrooms with frameless glass and matte-black fixtures', 
            description: ''
          }, {
            title: 'Impact-resistant windows & 10-ft sliders for storm security and light', 
            description: ''
          }, {
            title: 'Italian-inspired kitchen: waterfall quartz island, walk-in pantry, pro-grade appliances', 
            description: ''
          }, {
            title: 'Indoor–outdoor living: covered porch, summer kitchen rough-in, pool with baja shelf', 
            description: ''
          }, {
            title: 'Dual living rooms for formal entertaining and casual lounge', 
            description: ''
          }, {
            title: 'Two balconies: one private to the upper suite, one shared for sunset views', 
            description: ''
          }, {
            title: 'Smart-home package: LED mood lighting, thermostats, door locks, EV-charger ready', 
            description: ''
          }, {
            title: 'Energy-efficient envelope, hybrid water heater and spray-foam insulation', 
            description: ''
          },
        ],
      } 
    ]   
  },

  data6: {
    title: 'Immersive Experience',
    url: '//storage.net-fs.com/hosting/7379150/67/',
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
    templateId: 'TEST',
    terms: "I agree to be contacted via call, email, and text. To opt-out, you can reply 'stop' at any time or click the unsubscribe link in the emails. Message and data rates may apply. For more information see our Terms of Service and Privacy Policy. Data will not be sold or shared for marketing or promotional purposes.",
    beds: [],
    purchase: [],
  },

  data9: []
}
