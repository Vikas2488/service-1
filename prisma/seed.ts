// import the necessary Prisma client and data models
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function seedVoices() {
  const voices = [
    {
      id: '658068f92647a40688c35159',
      sampleLink:
        'https://zekyaa-public-ijbdfw39ubfo.s3.amazonaws.com/dashboard/voices/Andrew.wav',
      name: 'Andrew',
      provider: 'azure',
      providerName: 'en-US-AndrewNeural',
    },
    {
      id: '658068f92647a40688c3515a',
      sampleLink:
        'https://zekyaa-public-ijbdfw39ubfo.s3.amazonaws.com/dashboard/voices/Brian.wav',
      name: 'Brian',
      provider: 'azure',
      providerName: 'en-US-BrianNeural',
    },
    {
      id: '658068f92647a40688c3515b',
      sampleLink:
        'https://zekyaa-public-ijbdfw39ubfo.s3.amazonaws.com/dashboard/voices/Emma.wav',
      name: 'Emma',
      provider: 'azure',
      providerName: 'en-US-EmmaNeural',
    },
    {
      id: '658068f92647a40688c3515c',
      sampleLink:
        'https://zekyaa-public-ijbdfw39ubfo.s3.amazonaws.com/dashboard/voices/Jane.wav',
      name: 'Jane',
      provider: 'azure',
      providerName: 'en-US-JaneNeural',
    },
  ];

  await prisma.voice.createMany({
    data: voices,
  });
}

async function seedNumbers() {
  try {
    const phoneNumbers = [
      {
        provider: 'twilio',
        number: '+61258496762',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        provider: 'twilio',
        number: '+61282610038',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        provider: 'twilio',
        number: '+61259439818',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        id: '657c21c58cdf01c92c0d43ad',
        provider: 'twilio',
        number: '+61256578877',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        id: '657c21ea8cdf01c92c0d43af',
        provider: 'twilio',
        number: '+61280156242',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        id: '657c22028cdf01c92c0d43b1',
        provider: 'twilio',
        number: '+61253022084',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
      {
        id: '657c22148cdf01c92c0d43b3',
        provider: 'twilio',
        number: '+61250227625',
        country: 'AU',
        capabilities: ['sms', 'voice'],
      },
    ];

    await prisma.phoneNumber.createMany({
      data: phoneNumbers,
    });

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedCalls() {
  try {
    const callIds = [
      'CA3702c8ef84c63bd02cd21a2241924a26',
      'CAfd502dfa9faf7347b695fbded1f29828',
      'CA6cc41d914fce637e6382d798e9adf94f',
      'CAe0a1e94e78a944ef9510b9de0fe1bc32',
      'CA93de9462c89b3efa330f4a0a742bda52',
      'CA7f6af96f27b253c5acd82e663fc3f326',
      'CA117eb1f293d789e4f086a6bb06bdcd5d',
      'CA158488651496b5182ba92ce1f04797d6',
      'CA2ecc293bcdd8ee0f2a1a68cb3c02c50c',
      'CA4531ed4a5e7e35457bfab42435f21974',
      'CA0da76a20123a2ff0559a0b496bff4974',
      'CAbbf2c026b74bdf34912504f71f6cd868',
      'CA6a9174a06b3404fed3535cfdd7795aa0',
    ];
    const promises = [];

    const conversation = [
      {
        role: 'assistant',
        timeAdded: new Date(),
        content: 'Hello! How can I assist you today?',
      },
      {
        role: 'user',
        timeAdded: new Date(new Date().getTime() + 1000), // Incremented by 1 second
        content: 'Hi there! I have a question about programming. Can you help?',
      },
      {
        role: 'assistant',
        timeAdded: new Date(new Date().getTime() + 2000), // Incremented by 2 seconds
        content:
          "Of course! I'll do my best to help. What programming question do you have?",
      },
      {
        role: 'user',
        timeAdded: new Date(new Date().getTime() + 3000), // Incremented by 3 seconds
        content:
          "I'm struggling with JavaScript promises. Can you explain how they work?",
      },
      {
        role: 'assistant',
        timeAdded: new Date(new Date().getTime() + 4000), // Incremented by 4 seconds
        content:
          'Certainly! JavaScript promises are used for asynchronous programming. They represent a value that might be available now, or in the future, or never. Promises have three states: pending, fulfilled, or rejected. You can chain them using .then() and .catch().',
      },
      {
        role: 'user',
        timeAdded: new Date(new Date().getTime() + 5000), // Incremented by 5 seconds
        content: 'Thanks for the explanation! That clarifies things for me.',
      },
      {
        role: 'assistant',
        timeAdded: new Date(new Date().getTime() + 6000), // Incremented by 6 seconds
        content:
          "You're welcome! If you have any more questions or need further clarification, feel free to ask.",
      },
    ];

    // Now 'conversation' array contains a full conversation with incremented dates.

    for (const callId of callIds) {
      const promise = axios.post(
        'http://localhost:4000/api/calls/add',
        {
          callId,
          messages: conversation,
          aiNumber: '+61258496762',
        },
        {
          headers: {
            authorization: 'Bearer superdupersecretkey',
          },
        },
      );
      promises.push(promise);
    }

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
}

async function seedClients() {
  await prisma.client.createMany({
    data: [
      {
        id: '657c226d8cdf01c92c0d43b6',
        clientWebsite: null,
        clientName: 'Demo Client',
        streetAddress: 'India and Australia',
        country: 'India',
        accountId: 'NA',
        createdAt: '2023-12-18T15:52:19.184Z',
        updatedAt: '2023-12-18T15:52:19.184Z',
      },
    ],
  });
}

async function seedFunctions() {
  await prisma.function.createMany({
    data: [
      {
        id: '657ce4ef8cdf01c92c0d4412',
        json: {
          name: 'send_warranty_details',
          description: 'Send warranty details webpage link via SMS.',
          parameters: {
            type: 'object',
            properties: {
              phone: {
                type: 'string',
                description: 'Roadside assistance phone number.',
              },
              webpage: {
                type: 'string',
                description: 'Roadside assistance information webpage link.',
              },
            },
            required: ['phone', 'webpage'],
          },
        },
        name: 'Send Warranty Details',
        description: 'Send warranty details webpage link via SMS.',
        libraryRequirements: ['twilio'],
      },
      {
        id: '657ce66e8cdf01c92c0d4414',
        json: {
          name: 'send_roadside_assist_details',
          description: 'Send roadside assist details via SMS.',
          parameters: {
            type: 'object',
            properties: {
              phone: {
                type: 'string',
                description: 'Roadside assistance phone number.',
              },
              webpage: {
                type: 'string',
                description: 'Roadside assistance information webpage link.',
              },
            },
            required: ['phone', 'webpage'],
          },
        },
        name: 'Send Roadside Assist Details',
        description: 'Send roadside assist details via SMS.',
        libraryRequirements: ['twilio'],
      },
      {
        id: '657ce6a48cdf01c92c0d4416',
        json: {
          name: 'send_booking_link_sms',
          description: 'Send the booking link by sms.',
          parameters: {
            type: 'object',
            properties: {
              link_identifier: {
                type: 'string',
                description: 'Proxy identifier for booking link to send.',
              },
            },
            required: ['link'],
          },
        },
        name: 'Send Booking Link SMS',
        description: 'Send the booking link by sms.',
        libraryRequirements: ['twilio'],
      },
      {
        id: '657ce6e48cdf01c92c0d4418',
        json: {
          name: 'forward_call_to_agent',
          description: 'For the call to service agents to handle.',
          parameters: { type: 'object', properties: {} },
        },
        name: 'Forward Call',
        description: 'For the call to service agents to handle.',
        libraryRequirements: [],
      },
      {
        id: '657ce7378cdf01c92c0d441a',
        json: {
          name: 'send_booking_details_to_agent',
          description:
            'Send booking details collected to service agents to handle.',
          parameters: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Properly formatted email of user.',
              },
              phone: { type: 'string', description: 'Phone number of user.' },
              service_type: {
                type: 'string',
                description: 'Service type user has chosen.',
              },
              registration_number: {
                type: 'string',
                description: "Registration number of user's vehicle.",
              },
            },
            required: ['email', 'phone', 'service_type', 'registration_number'],
          },
        },
        name: 'Send Booking Details to Agent',
        description:
          'Send booking details collected to service agents to handle.',
        libraryRequirements: [],
      },
    ],
  });
}

async function seedLlm() {
  await prisma.llm.create({
    data: {
      id: '657cde608cdf01c92c0d4408',
      provider: 'openai',
      name: 'gpt-4-1106-preview',
    },
  });
}

async function seedPhoneConfigs() {
  await prisma.phoneConfig.createMany({
    data: [
      {
        id: '657cd9fc8cdf01c92c0d43e4',
        clientId: '657c226d8cdf01c92c0d43b6',
        isActive: true,
        llmId: '657cde608cdf01c92c0d4408',
        voiceId: '658068f92647a40688c3515b',
        greetingMessage:
          'Hello! Thank you for calling the our Hair Salon. What are you looking for today?',
        phoneNumberId: '657c21c58cdf01c92c0d43ad',
        prompt:
          "You're a Service Desk Agent for a hair salon. Be polite, clear, empathetic, and customer-focused. Keep conversations conversational like a human. Only use one to two sentences in each answer.\nGuidelines:\nDon’t end the call unless the customer confirms. Only ask customer details once in a phone call. Customer details to ask are: First name, phone number, email. Ask one detail at a time.\n\nAnswering different types of questions\nBooking an appointment: Ask for the date, time, and customer details.\nIf the time requested is available, then book for the customer. If not, Ask if they can book the next available time. Once booked, tell the customer that booking information has been sent to their email and phone.\nOpening times are 7 days a week 9am to 6pm\n\nPricing list:\n    Mens hair Cut - $35\n    Kids - $25\n    Senior/Pensioner - $25\n    Buzz/Clipper - $25\n    Zero Fade extra - $5",
        createdAt: '2023-12-18T15:52:19.184Z',
        updatedAt: '2023-12-18T19:03:11.650Z',
      },
      {
        id: '657cda048cdf01c92c0d43e6',
        clientId: '657c226d8cdf01c92c0d43b6',
        isActive: true,
        llmId: '657cde608cdf01c92c0d4408',
        voiceId: '658068f92647a40688c3515b',
        greetingMessage:
          'Hello! Thank you for calling the our Beauty Salon. What are you looking for today?',
        phoneNumberId: '657c21ea8cdf01c92c0d43af',
        prompt:
          "You're a Service Desk Agent for a Beauty salon. Be polite, clear, empathetic, and customer-focused. Keep conversations conversational like a human. Only use one to two sentences in each answer.\nGuidelines:\nDon’t end the call unless the customer confirms. Only ask customer details once in a phone call. Customer details to ask are: First name, phone number, email. Ask one detail at a time.\n\nAnswering different types of questions\nBooking an appointment: Ask for the date, time, and customer details.\nIf the time requested is available, then book for the customer. If not, Ask if they can book the next available time. Once booked, tell the customer that booking information has been sent to their email and phone.\nOpening times are 7 days a week 9am to 6pm\n\n1. Naked Manicure: $40 - Includes trimming and shaping of nails, basic cuticle care, and a hot towel cleanse.\n2. Classic Manicure: $55 - Includes nail trimming and shaping, cuticle care, a single gel color, and a hot towel cleanse. Surcharge for special gels.\n3. Naked Pedicure: $50 - Includes nail trimming and shaping, basic cuticle care, and a hot towel cleanse.\n4. Classic Pedicure: $65 - Includes nail trimming and shaping, cuticle care, a single gel color, and a hot towel cleanse. Surcharge for special gels.\n5. Gel Removal: $20 - $30 for removal of acrylic/SNS/hard gel, $10 when rebooking.\n\n# Lashes\n\n1. Elegant Set: Full set $110 / Infill $60 - Single lash extensions with a 1:1 technique.\n2. Classic Set: Full set $140 / Infill $90 - Single lash extensions with a 1:1 technique.\n3. Hybrid Set: Full set $170 / Infill $120 - Mix of classic lashes and volume fans.\n4. Signature Set: Full set $190 / Infill $140 - Handmade 3D-4D volume lashes.\n5. Glamorous Set: Full set $250 / Infill $200 - Handmade 5D+ volume lashes.\n6. Lash Lift (with tint): $99 - Lasts 6-8 weeks.\n7. Lash Lift (no tint): $94 - Lasts 6-8 weeks.\n8. Extension Removal: $30 - $10 discount if removed before a new set.\n\n# Brows\n\n1. Brow Lamination: $140 - Includes waxing, grooming, and tinting. Lasts up to 45 minutes.\n2. Brow Tint: $25 - Tinting only, lasts 2-3 weeks.\n3. Brow Henna: $45 - Tints hair and skin, lasts 4-6 weeks on hair and 2 weeks on skin.\n\n# Waxing (Face)\n\n1. Eyebrows: $25\n2. Upper Lip: $15\n3. Chin: $20\n4. Facial Sides: $25\n5. Eyebrows and Upper Lip: $35\n6. Upper Lip and Chin: $30\n7. Eyebrows, Upper Lip, and Chin: $45\n8. Full Face: $60\n\n# Waxing (Body)\n\n1. Underarms: $25\n2. Half Arms: $35\n3. Full Arms: $45\n\n# Waxing (Combination)\n\n1. Half Legs and Bikini: $65\n2. Full Legs and Bikini: $80",
        createdAt: '2023-12-18T15:52:19.184Z',
        updatedAt: '2023-12-18T19:03:11.650Z',
      },
      {
        id: '657cda098cdf01c92c0d43e8',
        clientId: '657c226d8cdf01c92c0d43b6',
        isActive: true,
        llmId: '657cde608cdf01c92c0d4408',
        voiceId: '658068f92647a40688c3515a',
        greetingMessage:
          'Hello! Thank you for calling Papa pizza. What are you looking for today?',
        phoneNumberId: '657c22028cdf01c92c0d43b1',
        prompt:
          "You're a Phone support agent for Papa pizza. Be polite, clear, empathetic, and customer-focused. Keep conversations conversational like a human. Only use one to two sentences in each answer. \nOpen 7 days a week 10:00am to 2:00am. The store takes pickup and delivery orders. Average delivery time is around 30 minutes. Average ready to pick up time is 20 minutes. Guidelines:\nDon’t end the call unless the customer confirms. Ask if you can assist with anything if there customer doesn’t request anything or before you hang up.\n\nOnly ask customer details once in a phone call. Customer details to ask are: First name, phone number, address. Ask one detail at a time.\n Answering questions:\n\nOrdering a pizza: Ask pick up or delivery first. Then ask what pizza (If customer hasn’t mentioned size, ask what size). Ask if any special requirements. \n\nTry to upsell drinks or desserts if customer hasn’t already mentioned before ending call. Finally separately ask cash or card payment. \n\nLet them know the summary of the order with cost and average time it will take for delivery driver to reach.\n\nMenu list:\nMini Range\nMenu Item\tPrice\nImpossible Supreme\t$7.99\nBBQ Meatlovers\t$5.99\nSupreme\t$5.99\n3 Meats\t$4.75\nHawaiian\t$4.75\nSpicy Veg Supreme\t$4.75\nPepperoni\t$4.00\nCheesy Garlic with Creme Fraiche\t$4.00\nMargherita\t$4.00\nHam & Cheese\t$4.00\nSimply Cheese\t$4.00\nValue Range\nMenu Item\tMini\tLarge\tExtra Large\nSimply Cheese\t$4.00\t$7.00\t$10.00\nMargherita\t$4.00\t$7.00\t$10.00\nPepperoni\t$4.00\t$7.00\t$10.00\nHam & Cheese\t$4.00\t$7.00\t$10.00\nValue Max Range – Large\nMenu Item\tPrice\n3 Meats \t$8.00\nDouble Beef & Onion\t$8.00\nSpicy Veg Supreme\t$8.99\nHawaiian\t$9.99\nLoaded Pepperoni\t$8.00\nGodfather\t$9.99\nTraditional Range\nMenu Item\tPrice\nChicken Supreme\t$14.99\nIndi Chicken Tikka\t$14.99\nSpicy Peppy Paneer\t$14.99\nFire Breather\t$14.99\nVegorama\t$14.99\nSupreme\t$14.99\nBBQ Meatlovers\t$14.99\nDouble Bacon Cheeseburger\t$14.99\nPremium Pizzas\nMenu Item\tPrice\nGarlic Chicken & Bacon Aioli\t$17.99\nLoaded Supreme\t$17.99\nMega Meatlovers\t$17.99\nChicken & Camembert\t$18.99\nPeri Peri Chicken\t$17.99\nBBQ Chicken & Rasher Bacon\t$17.99\nGarlic Prawn\t$17.99\nPizza Pastas\nMenu Item\tPrice\nSimply Mac & Cheese\t$8.99\nSimply Bacon Mac & Cheese\t$11.99\nChicken & Bacon\t$12.99\nMeatlovers\t$12.99\nVegorama\t$12.99\nFirebreather\t$12.99\nNew Yorker Pizzas\nMenu Item\tPrice\nBig Cheese\t$18.99\nBig Hawaiian\t$18.99\nBig Pepperoni\t$18.99\nImpossible Pizza Pizzas\nMenu Item\tPrice\nImpossible Double Beef & Onion\t$15.99\nImpossible Fire Breather\t$16.99\nImpossible Godfather\t$16.99\nImpossible Supreme\t$17.99\nMini Impossible Supreme\t$7.99\nMy Domino’s Box\nMenu Item\tPrice\n1 Value Mini Pizza + 2 Sides\t$10.00\nVegan Range\nMenu Item\tPrice\nVegan Spicy Veg Supreme\t$11.98\nVegan Magherita\t$9.99\nVegan Cheesy Garlic Bread\t$7.00\nMake Your Own\nMenu Item\tPrice\nDesigna 4 Toppings\t$14.99\nHalf ‘n’ Half\t$14.99\nCrusts & Upgrades\nMenu Item\tPrice\nGluten Free Sour Dough Base\t$2.95\nGluten Free Crust\t $2.95\nCheesy Crust\t$3.45\nVegan Cheese\t$2.95\nExtra Large\t$3.00\nSides\nMenu Item\tPrice\nGarlic Bread\t$4.00\nOven Baked Chips\t$5.00\nCheesy Garlic Bread\t$5.00\nDipping Sauce\t$0.50\nVegan Cheesy Garlic Bread\t$7.00\nChicken Tenders\t$6.99 – 3 pack",
        createdAt: '2023-12-18T15:52:19.184Z',
        updatedAt: '2023-12-18T19:03:11.650Z',
      },
      {
        id: '657cda0f8cdf01c92c0d43ea',
        clientId: '657c226d8cdf01c92c0d43b6',
        isActive: true,
        llmId: '657cde608cdf01c92c0d4408',
        voiceId: '658068f92647a40688c35159',
        greetingMessage:
          'Hello! Thank you for calling the Homebush LDV Service Center. How can I assist you today?',
        phoneNumberId: '657c22148cdf01c92c0d43b3',
        prompt:
          "You're a Service Desk Agent answering customer calls for an auto dealer service center based in Australia. Always be polite, clear, empathetic, cheerful, and customer-focused in your interactions. Keep conversations conversational like a human call support agent. \n\nOperating hours: Monday to Friday, 7:30 am to 4:30 pm\n\nA few basic guidelines:\n\n1. If the call is during office hours and you cannot resolve it, then forward the call. If it's outside office hours, tell them someone will call you to confirm the booking the next business day. No need to tell customers about office hours or not. \n2. Don’t end the call unless you confirm with the customers. Keep asking if you can assist with anything.\n3. If you already have the customer’s details like first name, last name, email, phone, vehicle registration, make, and model in a single call, then no need to ask again.\n\nAnswering different types of questions:\n\n1. Booking a service: Ask about the vehicle's make and model.\n    1. Ask the customer if they would the booking link to be sent. If the customer agrees, then text booking link using 'send_booking_link_sms' tool and identifier 'HBSHLDV'.\n    2. If they don’t want to book themselves, then tell them you will get their information and forward it to the team and someone will contact them to confirm booking. ask for their first name and last name. Ask for their email. Ask phone number. Ask if it's a diagnostic or a logbook service. Lastly, ask for their vehicle registration. Make sure to ask one information at a time. If all information is collected, send info using 'send_booking_details_to_agent' tool.\n2. Checking vehicle service status: Ask for their first name, phone number, and vehicle registration number. \n    1. If it is during office hours, then forward the call using 'forward_call_to_agent' tool.\n    2. If not, then assure them someone will shortly contact them to confirm status. And send user info using 'send_booking_details_to_agent' tool.\n3. Something wrong with their vehicle and issues with their vehicle\n    1. Apologize and tell them that they cannot know without inspecting the car. Ask if they are happy to book a diagnostic service. If the customer agrees, then ask for their first name and last name. Ask for their email. Ask for their vehicle registration. Ask to repeat the issue. Make sure to ask one information at a time. \n        1. If it is during office hours, then forward the call using 'forward_call_to_agent' tool.\n        2. If it is outside of office hours, then repeat to confirm their information first. Assure them that the team has received the request and that someone call them to confirm the booking the next business day. \n4. Loan Car or courtesy car: The company offers loan cars for customers for $70 per day subject to availability. Customers need to have a full Australian license. Ask if they need a loan car.\n    1. Forward the call if the customer wants to book a loan car during office hours using 'forward_call_to_agent' tool.\n    2. Get their information and assure them that the team has received the request and that someone call them to confirm the booking the next business day. \n5. Customer shuttle bus, and train station transport services: The dealership provides a shuttle bus service for customers to pick up and drop off at the nearest train station for free with pre-bookings. A valet service is also available for additional fees which customers need to book earlier. \n    1. Forward the call if the customer wants to book a shuttle bus or courtesy if the call is during office hours using 'forward_call_to_agent' tool.\n    2. Get their information and assure them that the team has received the request and that someone call them to confirm the booking the next business day. \n6. Parts and accessories: The service center also has a parts and accessories department. \n    1. Forward the call for all parts and accessory inquiries to during office hours using 'forward_call_to_agent' tool.\n    2. Get their information and assure them we received their request and someone will contact them earliest available next business day.\n7. Roadside assist: For all roadside assistance inquiries, customers need to contact the main OEM roadside department. Ask them if they want you to send the contact details and link to more information. \n    1. If the customer agrees then forward the following details using 'send_roadside_assist_details' tool.\n    LDV roadside assistance contact: [1800 709 832](tel:1800709832)\n    More information: https://www.ldvautomotive.com.au/roadside/\n8.  Warranty inquiries: For all warranty inquiries, ask for the vehicle's make, model, make year, and registration number.\n    1. If the vehicle’s make year is older than 5 years from now, then the vehicle is out of warranty\n    2. To learn more about the warranty, you can forward this link - https://www.ldvautomotive.com.au/warranty/, send this using 'send_warranty_details' tool.\n    3. For all other warranty issues, forward the call if it is during office hours using 'forward_call_to_agent' tool. If its outside office hours, get their contact information and assure them we received their request and someone will contact them earliest available next business day.",
        createdAt: '2023-12-18T15:52:19.184Z',
        updatedAt: '2023-12-18T19:03:11.650Z',
      },
    ],
  });
}

async function seedMailCampaigns() {
  await prisma.mailCampaign.createMany({
    data: [
      {
        campaignClientId: '65d32de56d2994369fddcb68',
        businessId: '1',
        businessName: 'ABC Company',
        businessEmail: 'info@abccompany.com',
        greeting_message: 'Welcome to ABC Company!',
        prompt: 'Press 1 for sales, press 2 for support',
        campaignVersion: 'MailCampaignDec2023',
      },
    ],
  });
}
// Order matters

// seedNumbers();
// seedVoices();
// seedFunctions();
// seedLlm();

// seedClients();
// seedPhoneConfigs();
seedCalls();
// seedMailCampaigns();
