export type Exam = {
  value: string;
  label: string;
  bangla: string;
  description: string;
};

export type Board = {
  value: string;
  label: string;
  bangla: string;
  city: string;
  established?: number;
  website?: string;
};

export const EXAMS: Exam[] = [
  {
    value: "jsc",
    label: "JSC / JDC",
    bangla: "জেএসসি / জেডিসি",
    description: "Junior School Certificate (Class 8).",
  },
  {
    value: "ssc",
    label: "SSC / Dakhil",
    bangla: "এসএসসি / দাখিল",
    description: "Secondary School Certificate (Class 10).",
  },
  {
    value: "ssc_voc",
    label: "SSC (Vocational)",
    bangla: "এসএসসি (ভোকেশনাল)",
    description: "Vocational Secondary School Certificate.",
  },
  {
    value: "hsc",
    label: "HSC / Alim",
    bangla: "এইচএসসি / আলিম",
    description: "Higher Secondary Certificate (Class 12).",
  },
  {
    value: "hsc_voc",
    label: "HSC (Vocational)",
    bangla: "এইচএসসি (ভোকেশনাল)",
    description: "Vocational Higher Secondary Certificate.",
  },
  {
    value: "hsc_hbm",
    label: "HSC (BM)",
    bangla: "এইচএসসি (বিএম)",
    description: "Business Management HSC.",
  },
  {
    value: "hsc_dic",
    label: "Diploma in Commerce",
    bangla: "ডিপ্লোমা ইন কমার্স",
    description: "Diploma in Commerce.",
  },
];

export const BOARDS: Board[] = [
  {
    value: "barisal",
    label: "Barisal",
    bangla: "বরিশাল",
    city: "Barisal",
    established: 1999,
    website: "https://www.barisalboard.gov.bd",
  },
  {
    value: "chittagong",
    label: "Chittagong",
    bangla: "চট্টগ্রাম",
    city: "Chittagong",
    established: 1995,
    website: "https://www.bise-ctg.gov.bd",
  },
  {
    value: "comilla",
    label: "Comilla",
    bangla: "কুমিল্লা",
    city: "Comilla",
    established: 1962,
    website: "https://www.comillaboard.gov.bd",
  },
  {
    value: "dhaka",
    label: "Dhaka",
    bangla: "ঢাকা",
    city: "Dhaka",
    established: 1921,
    website: "https://www.dhakaeducationboard.gov.bd",
  },
  {
    value: "dinajpur",
    label: "Dinajpur",
    bangla: "দিনাজপুর",
    city: "Dinajpur",
    established: 2006,
    website: "https://www.dinajpureducationboard.gov.bd",
  },
  {
    value: "jessore",
    label: "Jessore",
    bangla: "যশোর",
    city: "Jessore",
    established: 1963,
    website: "https://www.jessoreboard.gov.bd",
  },
  {
    value: "mymensingh",
    label: "Mymensingh",
    bangla: "ময়মনসিংহ",
    city: "Mymensingh",
    established: 2017,
    website: "https://www.mymensingheducationboard.gov.bd",
  },
  {
    value: "rajshahi",
    label: "Rajshahi",
    bangla: "রাজশাহী",
    city: "Rajshahi",
    established: 1961,
    website: "https://www.rajshahieducationboard.gov.bd",
  },
  {
    value: "sylhet",
    label: "Sylhet",
    bangla: "সিলেট",
    city: "Sylhet",
    established: 1999,
    website: "https://www.sylhetboard.gov.bd",
  },
  {
    value: "madrasah",
    label: "Madrasah",
    bangla: "মাদ্রাসা",
    city: "Dhaka",
    established: 1979,
    website: "https://www.bmeb.gov.bd",
  },
  {
    value: "tec",
    label: "Technical",
    bangla: "কারিগরি",
    city: "Dhaka",
    established: 1954,
    website: "https://www.bteb.gov.bd",
  },
  {
    value: "dibs",
    label: "DIBS (Dhaka)",
    bangla: "ডিআইবিএস (ঢাকা)",
    city: "Dhaka",
  },
];

export function getYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= 1996; y--) years.push(y);
  return years;
}

export const RESULT_TYPES = [
  { value: "1", label: "Individual Result" },
  { value: "2", label: "Institution Result" },
  { value: "3", label: "Center Result" },
  { value: "4", label: "District Result" },
  { value: "5", label: "Board Analytics" },
];
