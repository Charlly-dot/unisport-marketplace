export const APPROVED_DOMAINS = [
  ".edu",
  ".edu.ng",
  "landmark.edu.ng",
];

export function isApprovedEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  return APPROVED_DOMAINS.some((domain) => lower.endsWith(domain));
}

export const CAMPUSES = [
  "University of Lagos (UNILAG)",
  "University of Ibadan (UI)",
  "Obafemi Awolowo University (OAU)",
  "Ahmadu Bello University (ABU)",
  "University of Nigeria (UNN)",
  "Lagos State University (LASU)",
  "Landmark University",
  "Covenant University",
  "Babcock University",
  "Other",
] as const;

export const FACULTIES = [
  "Faculty of Engineering",
  "Faculty of Science",
  "Faculty of Arts",
  "Faculty of Law",
  "Faculty of Social Sciences",
  "Faculty of Management Sciences",
  "Faculty of Education",
  "Faculty of Medicine",
  "Faculty of Environmental Sciences",
  "Faculty of Agriculture",
] as const;

export const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level", "Postgraduate"] as const;
