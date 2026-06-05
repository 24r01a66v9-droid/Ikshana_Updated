import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Palette, PenTool, Image as ImageIcon, Heart, ShieldCheck, X, Award, ArrowRight, Upload, Trash2, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface EventPhoto {
  id: string;
  url: string;
  title?: string;
  caption?: string;
  is_featured: boolean;
}

interface Activity {
  name: string;
  icon: any;
  description: string;
}

interface Event {
  title: string;
  date: string;
  occasion: string;
  description: string;
  activities: Activity[];
  acknowledgments?: string;
  image?: string | null;
}

export default function PastEvents() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventPhotos, setEventPhotos] = useState<EventPhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const events: Event[] = [
    {
      title: "Donation Drive for World Cancer Awareness Day",
      date: "November 9th, 2024",
      occasion: "Cancer Awareness & Medical Support",
      description: "On November 9, 2024, Ikshana Student Organization hosted a donation drive on campus to raise funds for Bommu Lakhmi Garu, a patient suffering from a serious pulmonary disease. The event aimed to raise ₹3,000,000 but successfully garnered ₹40,000, showcasing strong support from students and faculty. Donation booths were set up across the campus, and engaging activities like tug of war, relay races, quiz competitions, and raffle draws were organized to encourage participation. The drive not only aimed to raise funds but also to raise awareness about cancer and related diseases.",
      activities: [
        {
          name: "Donation Booths",
          icon: Heart,
          description: "Multiple donation booths were strategically set up across the campus to collect contributions from students and faculty members."
        },
        {
          name: "Engaging Activities",
          icon: Palette,
          description: "Fun and competitive activities including tug of war, relay races, quiz competitions, and raffle draws were organized to encourage participation and raise funds."
        },
        {
          name: "Awareness Campaign",
          icon: ShieldCheck,
          description: "The drive raised awareness about cancer and related diseases, helping the college community understand the importance of health and support for medical causes."
        }
      ],
      acknowledgments: "Special thanks to all students and faculty who came forward to raise their helping hand for this noble cause. The overwhelming support raised ₹40,000 for Bommu Lakhmi Garu's medical treatment.",
      image: null
    },
    {
      title: "SIDDHI 3.0",
      date: "September 11th, 2024",
      occasion: "Vinayaka Chavithi Celebration",
      description: "On September 11, 2024, Ikshana organized a Vinayaka Chavithi celebration at CMRIT, where 2nd and 3rd-year students participated in various creative and intellectual competitions. The event blended tradition with modern thought, featuring idol making, essay writing, debate, and a quiz, focusing on themes like spirituality, science, and mythology. The judging panel consisting of faculty members evaluated participants based on creativity, depth, and knowledge. The event successfully celebrated the festival, fostering a sense of community and inspiring future celebrations with its blend of creativity and intellectual discourse.",
      activities: [
        {
          name: "Idol Making",
          icon: Palette,
          description: "Students showcased their creativity by crafting beautiful Ganesha idols in various forms, expressing devotion and artistic skill."
        },
        {
          name: "Essay Writing & Debate",
          icon: PenTool,
          description: "Students explored deeper cultural and scientific ideas through essay writing on themes like spirituality, science, mythology, while engaging in intellectual debates on topics such as Science vs Spirituality and the true meaning of happiness."
        },
        {
          name: "Quiz Competition",
          icon: Award,
          description: "A quiz focused on mythology and cultural knowledge, testing students' understanding of traditional wisdom and contemporary relevance."
        }
      ],
      acknowledgments: "Special thanks to all faculty members who served as judges and mentors, and to all 203 participants who made this celebration a memorable success.",
      image: null
    },
    {
      title: "Visit to Gundla Pochampalley",
      date: "June 1st, 2024",
      occasion: "Educational Awareness & Community Support",
      description: "On June 1st, 2024, the Ikshana team visited Gundla Pochampalley village to promote the importance of education. They began by going door-to-door, educating families about the significance of children's education. Afterward, they gathered the children for engaging entertainment activities, including dance and singing performances, while reinforcing the value of learning. The team distributed chocolates and drinks to the children, followed by the distribution of essential stationery items such as books, pens, and other supplies to support their studies. The visit was a successful initiative that not only spread awareness about education but also brought joy and support to the community.",
      activities: [
        {
          name: "Door-to-Door Education",
          icon: Heart,
          description: "Team members visited homes in Gundla Pochampalley to educate families about the significance and importance of children's education."
        },
        {
          name: "Entertainment & Engagement",
          icon: Palette,
          description: "Organized engaging entertainment activities including dance and singing performances to keep children entertained while reinforcing the value of learning."
        },
        {
          name: "Distribution of Supplies",
          icon: ShieldCheck,
          description: "Distributed chocolates, drinks, and essential stationery items including books, pens, and other supplies to support children's educational pursuits."
        }
      ],
      acknowledgments: "Thanks to all 33 volunteers who participated in this initiative and helped spread awareness and support to the community.",
      image: null
    },
    {
      title: "Mock Assembly (2nd Year Students)",
      date: "April 25th, 2024",
      occasion: "Parliamentary Proceedings & Governance",
      description: "On April 25th, 2024, Ikshana organized a Mock Assembly for 2nd-year students, offering them a hands-on experience in parliamentary proceedings and governance. The event provided a platform for students to engage in lively discussions on current political and social issues, enhancing their communication and public speaking skills. By actively participating in debates and expressing their viewpoints, students gained a deeper understanding of how assemblies function, while also developing critical thinking abilities and fostering teamwork. The event successfully demonstrated the democratic process in action.",
      activities: [
        {
          name: "Parliamentary Simulation",
          icon: Award,
          description: "Students experienced realistic parliamentary proceedings, understanding the structure and functioning of legislative bodies."
        },
        {
          name: "Debate on Current Issues",
          icon: PenTool,
          description: "Students engaged in lively discussions on current political and social issues, developing their argumentation and critical thinking skills."
        },
        {
          name: "Communication & Leadership",
          icon: Heart,
          description: "The event enhanced participants' public speaking skills, communication abilities, and fostered teamwork and collaborative decision-making."
        }
      ],
      acknowledgments: "Thanks to all 64 participants for their enthusiastic engagement and making this mock assembly a valuable learning experience.",
      image: null
    },
    {
      title: "Christmas Donation Drive 2023",
      date: "December 21st - 23rd, 2023",
      occasion: "Winter Giving",
      description: "A non-governmental organization (NGO) initiative aimed at supporting underprivileged children. This drive exemplified the spirit of giving and philanthropy within the college community through collaborative efforts and active participation. The enthusiastic response from both students and faculty members reflected a strong sense of community and compassion within the college.",
      activities: [
        {
          name: "Class Promotions",
          icon: Heart,
          description: "Members of Club Ikshana actively promoted the donation drive by visiting different classes across the college campus, spreading awareness and encouraging fellow students and teachers to contribute."
        },
        {
          name: "Donation Stall",
          icon: ShieldCheck,
          description: "A donation stall was strategically placed in a high-traffic area within the college premises for three consecutive days to maximize visibility and accessibility."
        },
        {
          name: "Flash Mob & Singing",
          icon: Palette,
          description: "To attract a larger crowd and engage them in the spirit of giving, Club Ikshana organized flash mob and singing performances that captivated the attention of students and faculty members."
        }
      ],
      acknowledgments: "Generous contributions including clothes, toys, books, and essential items were collected and handed over to 'KARUNA'. Special thanks to our Director Dr. M. Janga Reddy Sir, Principal B. Satyannarayana Sir, Respected HOD's, Dean Student Affairs, and Shakeel Sir for their unwavering support.",
      image: null
    },
    {
      title: "Books Donation Drive 2024",
      date: "June 1st, 2024",
      occasion: "Educational Support Initiative",
      description: "On June 1st, 2024, the Ikshana team conducted a book donation drive in Gundlapochampally. The funds for the event were raised through the Mock Assembly conducted in April, allowing us to buy books and stationery for children. Our goal was to support education and bring happiness to these children by giving them necessary learning materials and involving them in enjoyable activities. The team assembled at the college to collect books and stationery items, then traveled to Gundlapochampally by college bus where they divided into smaller groups to visit homes door-to-door.",
      activities: [
        {
          name: "Collection & Distribution",
          icon: Heart,
          description: "The team collected books and stationery items at the college, then traveled to Gundlapochampally to distribute them. Each child was graciously presented with a set of books and requisite stationery, all intended to facilitate and enrich their educational pursuits."
        },
        {
          name: "Community Engagement",
          icon: ShieldCheck,
          description: "The team divided into smaller groups to visit homes in Gundlapochampally. They spoke directly with parents, explained the purpose of the visit, and highlighted the benefits of the educational and fun activities planned, hoping to motivate parents to allow their children to participate."
        },
        {
          name: "Interactive Activities",
          icon: Palette,
          description: "Once the children gathered, the team organized various activities aimed at both entertaining and educating them. These included fun games, interactive learning sessions, and creative workshops that made the experience rewarding for both volunteers and participants."
        }
      ],
      acknowledgments: "We express our heartfelt gratitude to everyone who contributed to the success of the book donation drive. Special thanks to our Director Dr. M. Janga Reddy and Mr. Shakeel Sir, as well as all members and volunteers of Ikshana for their hard work and dedication. We also extend our thanks to the local community for their support and participation. This achievement was made possible through the collective effort and commitment of all those who worked tirelessly to make a positive impact on the lives of children in Gundlapochampally.",
      image: null
    },
    {
      title: "Mock Assembly 2023",
      date: "May 20th, 2023",
      occasion: "First Year Student Program",
      description: "The Ikshana Foundation of CMR Institute of Technology, Medchal, Hyderabad, organized a Mock Assembly to provide first year students with a practical experience of how actual legislative proceedings take place. The purpose of this initiative was to offer students a practical insight into the functioning of a democratic system and the legislative process. By participating in the Mock Assembly, students not only gained valuable practical experience but also cultivated a sense of civic responsibility and empowerment.",
      activities: [
        {
          name: "Role Assignment",
          icon: Award,
          description: "Students were assigned roles such as legislators, speakers, and members of the public, allowing them to experience different perspectives within the democratic system."
        },
        {
          name: "Debate & Discussion",
          icon: PenTool,
          description: "Students debated and discussed mock bills and resolutions, mirroring the procedures followed in real legislative bodies and gaining deeper understanding of parliamentary protocol and debate etiquette."
        },
        {
          name: "Communication Skills",
          icon: Heart,
          description: "Through this interactive simulation, students honed their communication and negotiation skills, learning the importance of active participation in democratic processes and informed decision-making."
        }
      ],
      acknowledgments: "This experience enriched students' education and empowered them to contribute meaningfully to their communities as informed and responsible citizens.",
      image: null
    },
    {
      title: "SIDDI 2.0 PROGRAM",
      date: "September 21, 2023",
      occasion: "Ganesh Chaturthi",
      description: "Siddi 2.0 served as a platform for students to express themselves, advocate for causes close to their hearts, and inspire positive change. It reinforced the values of empathy, respect, and environmental stewardship, reminding us of our interconnectedness with each other and the world around us.",
      activities: [
        {
          name: "Craft Making",
          icon: Palette,
          description: "Students showcased their creativity by crafting beautiful representations of Lord Ganesha using natural materials like clay and plants, infusing the artworks with a sense of harmony and reverence for the environment."
        },
        {
          name: "Essay Writing",
          icon: PenTool,
          description: "Students explored themes like Sanatana Dharma, Life at CMRIT, Changing India's name to Bharat, Social Media Addiction, and Climate Change, explaining how these teachings help people grow spiritually and behave well."
        },
        {
          name: "Poster Making",
          icon: ImageIcon,
          description: "Students crafted visually compelling posters advocating for animal rights, mobile addiction awareness, and cultural diversity, serving as impactful reminders of the importance of compassion and empathy."
        }
      ],
      acknowledgments: "Special thanks to our Director Dr. M. Janga Reddy Sir, Principal B. Satyannarayana Sir, and the entire leadership team for their guidance.",
      image: null
    },
    {
      title: "HandPrint Stall 2023",
      date: "April 9th, 2023",
      occasion: "Annual Fundraising",
      description: "A brilliant fusion of creativity, community engagement, and fundraising ingenuity. By inviting students to leave their unique handprints on various surfaces, the initiative turned a simple act into a visually striking representation of unity and collaboration.",
      activities: [
        {
          name: "Creative Fusion",
          icon: Palette,
          description: "Combining art and philanthropy to engage the college community in a unique and memorable way."
        },
        {
          name: "Community Engagement",
          icon: ShieldCheck,
          description: "Inviting students to actively participate and leave their mark, fostering a sense of ownership and pride."
        },
        {
          name: "Fundraising Ingenuity",
          icon: Heart,
          description: "Going beyond traditional fundraising methods to create an impactful and visually stunning experience."
        }
      ],
      acknowledgments: "A visually striking representation of unity and collaboration within the college premises.",
      image: null
    },
    {
      title: "Pureathon",
      date: "December 16th, 2022",
      occasion: "Collaboration with PURE",
      description: "A groundbreaking walkathon dedicated to raising awareness about period poverty. By joining forces with PURE, Team IKSHANA leveraged resources and expertise to make a meaningful impact on this pressing social issue, ensuring menstrual equity for all.",
      activities: [
        {
          name: "Walkathon",
          icon: Heart,
          description: "Mobilizing communities to take action and support those in need through a dedicated awareness walk."
        },
        {
          name: "Awareness Campaign",
          icon: ShieldCheck,
          description: "Shedding light on the challenges faced by individuals lacking access to menstrual hygiene products and education."
        },
        {
          name: "Advocacy",
          icon: PenTool,
          description: "Taking concrete steps towards ensuring menstrual equity through fundraising and community mobilization."
        }
      ],
      acknowledgments: "A significant step forward in addressing complex social issues through collective action and collaboration.",
      image: null
    },
    {
      title: "Girl's Orphanage Visit",
      date: "August 15th, 2022",
      occasion: "Community Bonding",
      description: "A transformative visit focused on genuine human connection and compassion. By sharing laughter, stories, and snacks, Team IKSHANA created an atmosphere of warmth and camaraderie, treating the residents not as recipients of charity, but as equals deserving of love and respect.",
      activities: [
        {
          name: "Joy & Normalcy",
          icon: Heart,
          description: "Focusing on the emotional needs of the girls by bringing a sense of joy and normalcy through evening talks and shared activities."
        },
        {
          name: "Meaningful Bonds",
          icon: ShieldCheck,
          description: "Forming lasting relationships and memories that left a profound impact on both the residents and the team members."
        },
        {
          name: "Shared Moments",
          icon: Palette,
          description: "Using the simple act of sharing food and snacks as a catalyst for conversation, laughter, and genuine companionship."
        }
      ],
      acknowledgments: "A beautiful example of how genuine human connections can foster a sense of belonging and joy.",
      image: null
    },
    {
      title: "HandPrint Stall",
      date: "April 8th, 2022",
      occasion: "Illuminate Fest",
      description: "An innovative approach to engage students through a vibrant Hand Print Stall. This dynamic initiative served a dual purpose: fostering creativity and participation while contributing to our ongoing fundraising efforts for impactful endeavors.",
      activities: [
        {
          name: "Creative Imprinting",
          icon: Palette,
          description: "Students left their unique mark by imprinting handprints on various surfaces, creating a visually striking display of unity."
        },
        {
          name: "Fundraising",
          icon: Heart,
          description: "Each handprint represented a meaningful contribution towards our shared cause, showcasing dedication to making a positive difference."
        },
        {
          name: "Community Spirit",
          icon: ShieldCheck,
          description: "The stall became a focal point for fostering community spirit and philanthropy, actively involving the college community."
        }
      ],
      acknowledgments: "A visually striking display that symbolizes unity, collaboration, and the collective effort of the college community.",
      image: null
    },
    {
      title: "Children's Orphanage Visit",
      date: "December 24th, 2019",
      occasion: "First Offline Event",
      description: "Our first offline event where contributions from the Christmas Donation Drive were channeled to bring joy and comfort to children at an orphanage. This philanthropic endeavor underscored the power of communal goodwill in fostering hope and solidarity.",
      activities: [
        {
          name: "Mock Assembly",
          icon: ShieldCheck,
          description: "A practical insight into the functioning of a democratic system and legislative process, where students debated mock bills and resolutions."
        },
        {
          name: "Essential Supplies",
          icon: Heart,
          description: "Supplying vital items such as food, hygiene products, and educational materials to address immediate needs of the children."
        },
        {
          name: "Festive Treats",
          icon: Palette,
          description: "Carefully selected items and treats to spread happiness and support during the holiday season."
        }
      ],
      acknowledgments: "A heartfelt thank you to our respected Director for supporting IKSHANA's first offline distribution drive.",
      image: null
    },
    {
      title: "Induction Programme",
      date: "November 30th, 2021",
      occasion: "Junior Member Welcome",
      description: "A meticulously planned induction program dedicated to enlightening our junior members about the profound significance of IKSHANA. We aim to instill a deep understanding of our mission, values, and the positive impact we have on the community through engaging sessions and interactive activities.",
      activities: [
        {
          name: "Informative Sessions",
          icon: Heart,
          description: "Providing insights into the organization's history, goals, and ongoing projects to inspire junior members to align themselves with our vision."
        },
        {
          name: "Interactive Activities",
          icon: ShieldCheck,
          description: "Fostering a sense of shared purpose and commitment among newcomers through collaborative and engaging group tasks."
        },
        {
          name: "Empowerment",
          icon: PenTool,
          description: "Equipping new members with the knowledge and motivation needed to become active contributors to our noble cause."
        }
      ],
      acknowledgments: "A vital role in welcoming new members and strengthening the foundation of IKSHANA's mission and goals.",
      image: null
    },
    {
      title: "Christmas Gift Drive",
      date: "December 8th & 9th, 2021",
      occasion: "Festive Giving",
      description: "A non-governmental organization (NGO) initiative aimed at supporting underprivileged children. This drive exemplified the spirit of giving and philanthropy within the college community through collaborative efforts and active participation.",
      activities: [
        {
          name: "Class Promotions",
          icon: Heart,
          description: "Actively promoted the donation drive by visiting different classes across the college campus to spread awareness and encourage contributions."
        },
        {
          name: "Donation Stall",
          icon: ShieldCheck,
          description: "A strategically placed donation stall was set up for three consecutive days to maximize visibility and accessibility for students and teachers."
        },
        {
          name: "Flash Mob & Singing",
          icon: Palette,
          description: "Organized flash mob and singing performances to attract a larger crowd and engage the community in the spirit of giving."
        }
      ],
      acknowledgments: "Generous contributions were handed over to 'KARUNA', making a meaningful difference in the lives of underprivileged children.",
      image: null
    },
    {
      title: "Contribution Drive",
      date: "October 3rd, 2021",
      occasion: "Post-SIDDI Outreach",
      description: "Organized by Ikshana Foundation of CMRIT, this drive utilized funds generously collected through the SIDDHI event to provide essential necessities to an orphanage during the challenging times of the COVID-19 pandemic. This support goes beyond monetary assistance, embodying a commitment to solidarity and empathy.",
      activities: [
        {
          name: "Food Supply",
          icon: Heart,
          description: "Supplying vital food items and groceries to ensure the well-being and comfort of children in the orphanage, addressing immediate nutritional needs."
        },
        {
          name: "Hygiene Products",
          icon: ShieldCheck,
          description: "Providing essential hygiene products to maintain health and offer a semblance of stability during uncertain times."
        },
        {
          name: "Educational Support",
          icon: PenTool,
          description: "Offering educational materials to support the continued learning and growth of the children, ensuring they have the tools needed for their studies."
        }
      ],
      acknowledgments: "Special thanks to our respected Director, HODs, faculty members, and all participants for their unwavering support and contributions.",
      image: null
    },
    {
      title: "SIDDI 1.0",
      date: "September 9, 2021",
      occasion: "Ganesh Chaturthi",
      description: "Siddi 1.0 served as a platform for students to express themselves, advocate for causes close to their hearts, and inspire positive change. It reinforced the values of empathy, respect, and environmental stewardship, reminding us of our interconnectedness with each other and the world around us.",
      image: null,
      activities: [
        {
          name: "Craft Making",
          icon: Palette,
          description: "During the event, the students showcased their creativity by crafting beautiful representations of Lord Ganesha using a variety of materials such as clay and plants. Each creation was a unique expression of devotion, skillfully molded and intricately designed to capture the essence of the beloved deity. The use of natural elements like clay and plants added a special touch, infusing the artworks with a sense of harmony and reverence for the environment."
        },
        {
          name: "Essay Writing",
          icon: PenTool,
          description: "In their essays, students talked about Sanathana Dharma and why it's important. They explained how it gives guidelines for how to live a good life and keep society balanced. They showed how these teachings are still useful today, helping people grow spiritually, behave well, and make communities peaceful."
        },
        {
          name: "Poster Making",
          icon: ImageIcon,
          description: "During the poster making session, students crafted visually compelling posters advocating for animal rights. Through their artwork, they aimed to give a voice to the voiceless creatures of our planet. Each poster depicted poignant imagery and powerful messages, urging viewers to recognize and respect the rights of animals. From emotive illustrations to thought-provoking slogans, these posters served as impactful reminders of the importance of compassion and empathy towards all living beings."
        }
      ]
    }
  ];

  useEffect(() => {
    if (selectedEvent) {
      fetchEventPhotos(selectedEvent.title);
    } else {
      setEventPhotos([]);
    }
  }, [selectedEvent]);

  const fetchEventPhotos = async (eventTitle: string) => {
    setLoadingPhotos(true);
    try {
      const response = await fetch(`/api/photos?category=event&sub_category=${encodeURIComponent(eventTitle)}`);
      if (response.ok) {
        const data = await response.json();
        setEventPhotos(data);
      }
    } catch (e) {
      console.error("Failed to fetch event photos", e);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleEventPhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedEvent || uploading) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadCaption || selectedEvent.title);
    formData.append("category", "event");
    formData.append("sub_category", selectedEvent.title);
    formData.append("date", selectedEvent.date);

    try {
      const response = await fetch("/api/photos", { method: "POST", body: formData });
      if (response.ok) {
        await fetchEventPhotos(selectedEvent.title);
        setUploadFile(null);
        setUploadCaption("");
      } else {
        const error = await response.json();
        alert(error.error || "Upload failed");
      }
    } catch (err) {
      console.error("Failed to upload event photo", err);
    } finally {
      setUploading(false);
    }
  };

  const removeEventPhoto = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    try {
      const response = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (response.ok && selectedEvent) {
        setEventPhotos(eventPhotos.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete event photo", err);
    }
  };

  return (
    <section id="events" className="py-32 px-6 bg-brand-cream relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-maroon/[0.03] -skew-x-12 transform origin-top-right" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-maroon/[0.02] skew-x-12 transform origin-bottom-left" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-8"
          >
            <div className="h-[2px] w-16 bg-brand-maroon"></div>
            <span className="text-brand-maroon font-bold tracking-[0.4em] uppercase text-[10px]">Our Journey</span>
          </motion.div>
          <h2 className="text-7xl md:text-9xl font-serif tracking-tighter leading-[0.85] mb-10 text-brand-maroon">
            Past Events <br />
            <span className="italic text-brand-maroon underline underline-offset-8 decoration-brand-maroon/10">& Initiatives.</span>
          </h2>
          <p className="text-brand-maroon/60 text-xl max-w-2xl leading-relaxed font-serif italic">
            "Every event is a milestone in our journey of compassion. We document our efforts to inspire others and celebrate the collective impact of our community."
          </p>
        </div>

        {events.map((event, eventIdx) => {
          return (
            <div key={eventIdx} className="mb-48 last:mb-0">
              <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto_1fr] items-start lg:items-center gap-12 mb-16">
                <div className="max-w-xl">
                  <span className="text-brand-maroon font-mono text-xs mb-4 block uppercase tracking-widest font-bold">{event.date}</span>
                  <h3 className="text-5xl md:text-6xl font-serif mb-8 leading-none text-brand-maroon">{event.title}</h3>
                  <p className="text-brand-maroon/70 text-xl leading-relaxed italic border-l-4 border-brand-maroon/20 pl-6">
                    "{event.description}"
                  </p>
                  {event.acknowledgments && (
                    <p className="mt-6 text-brand-maroon/40 text-sm font-serif italic">
                      {event.acknowledgments}
                    </p>
                  )}
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="mt-10 flex items-center gap-3 text-brand-maroon font-bold tracking-widest uppercase text-[10px] group"
                  >
                    View Full Event Details
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
                  </button>
                </div>

                <div className="hidden lg:block h-32 w-px bg-brand-maroon/10" />
                
                <div className="flex flex-col items-start lg:items-end gap-6">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon/40 block mb-2">Occasion</span>
                    <span className="text-3xl font-serif text-brand-maroon italic">{event.occasion}</span>
                  </div>
                </div>
              </div>

              {/* Activities Grid */}
              <div className="grid md:grid-cols-3 gap-8">
                {event.activities.map((activity, i) => (
                  <motion.div
                    key={activity.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-[3rem] p-12 border border-stone-100 hover:border-brand-maroon/20 transition-all group hover:shadow-2xl duration-500"
                  >
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-brand-maroon mb-10 group-hover:bg-brand-maroon group-hover:text-white transition-all duration-500 shadow-sm">
                      <activity.icon size={28} />
                    </div>
                    <h4 className="text-3xl font-serif mb-6 text-brand-maroon">{activity.name}</h4>
                    <p className="text-brand-maroon/60 leading-relaxed text-base">
                      {activity.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-6xl h-full max-h-[90vh] bg-brand-cream rounded-[4rem] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 sm:p-12 bg-white border-b border-stone-100 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1.5 bg-brand-maroon/10 text-brand-maroon rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {selectedEvent.occasion}
                    </span>
                    <span className="text-stone-400 font-mono text-[10px] uppercase tracking-widest">
                      {selectedEvent.date}
                    </span>
                  </div>
                  <h3 className="text-4xl sm:text-6xl font-serif text-brand-maroon leading-none">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 hover:text-brand-maroon hover:bg-white transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-grow overflow-y-auto p-8 sm:p-12 custom-scrollbar">
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
                  {/* Left Column: Info */}
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40 mb-6">The Story</h4>
                      <p className="text-2xl font-serif italic text-brand-maroon/80 leading-relaxed">
                        "{selectedEvent.description}"
                      </p>
                    </section>

                    <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40 mb-8">Key Activities</h4>
                      <div className="space-y-8">
                        {selectedEvent.activities.map((activity, i) => (
                          <div key={i} className="flex gap-8 group">
                            <div className="w-14 h-14 shrink-0 bg-white rounded-2xl flex items-center justify-center text-brand-maroon shadow-sm group-hover:bg-brand-maroon group-hover:text-white transition-all duration-500">
                              <activity.icon size={24} />
                            </div>
                            <div>
                              <h5 className="text-xl font-serif text-brand-maroon mb-2">{activity.name}</h5>
                              <p className="text-brand-maroon/60 leading-relaxed">{activity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {selectedEvent.acknowledgments && (
                      <section className="p-8 bg-white rounded-[2rem] border border-stone-100 italic">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40 mb-4 not-italic">Acknowledgments</h4>
                        <p className="text-brand-maroon/60 leading-relaxed">
                          {selectedEvent.acknowledgments}
                        </p>
                      </section>
                    )}
                  </div>

                  {/* Right Column: Gallery */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-maroon/40">Event Gallery</h4>
                      <div className="flex items-center gap-3">
                        {loadingPhotos && <div className="w-4 h-4 border-2 border-brand-maroon/20 border-t-brand-maroon rounded-full animate-spin" />}
                        {isAdmin && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-maroon/40 flex items-center gap-1">
                            <Camera size={12} /> Admin Upload
                          </span>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <form onSubmit={handleEventPhotoUpload} className="p-6 bg-white rounded-[2rem] border border-stone-100 space-y-4">
                        <div
                          className="relative border-2 border-dashed border-stone-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-maroon/30 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {uploadFile ? (
                            <div className="flex flex-col items-center">
                              <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="w-24 h-24 rounded-xl object-cover mb-3" />
                              <p className="text-xs text-brand-maroon/60">{uploadFile.name}</p>
                            </div>
                          ) : (
                            <>
                              <Upload size={24} className="text-stone-300 mb-2" />
                              <p className="text-[10px] uppercase tracking-widest text-stone-400">Click to upload event photo</p>
                            </>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && setUploadFile(e.target.files[0])}
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Caption (optional)"
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          className="w-full border-b border-stone-200 py-2 text-sm focus:outline-none focus:border-brand-maroon font-serif"
                        />
                        <button
                          type="submit"
                          disabled={!uploadFile || uploading}
                          className="w-full bg-brand-maroon text-white py-3 rounded-xl font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all disabled:opacity-50"
                        >
                          {uploading ? "Uploading..." : "Upload to Event"}
                        </button>
                      </form>
                    )}

                    {eventPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {eventPhotos.map((photo) => (
                          <motion.div 
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm group relative"
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.title || photo.caption}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-brand-maroon/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                              <p className="text-white text-[10px] font-medium leading-tight">{photo.title || photo.caption}</p>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => removeEventPhoto(photo.id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white text-brand-maroon rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-stone-900 hover:text-white transition-all shadow-lg"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square rounded-[3rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-center p-12 bg-white/50">
                        <ImageIcon size={48} className="text-stone-200 mb-6" />
                        <p className="text-stone-400 font-serif italic">No photos available for this event archive yet.</p>
                        {isAdmin && (
                          <p className="text-brand-maroon/40 text-xs mt-3 uppercase tracking-widest font-bold">Use the form above to upload</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-white border-t border-stone-100 flex justify-center">
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="bg-brand-maroon text-white px-12 py-4 rounded-full font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all shadow-xl shadow-brand-maroon/20"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
