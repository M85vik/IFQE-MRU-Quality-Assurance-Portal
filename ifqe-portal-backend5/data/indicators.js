// data/indicators.js
// This file contains all 125 performance indicators transcribed from the IFQE.pdf document.

const indicators = [
  // =======================================================================
  // CRITERIA 1: ACADEMIC EXCELLENCE & PEDAGOGY [cite: 131]
  // =======================================================================

  // --- Sub-Criteria 1.1: CURRICULUM DESIGN [cite: 132]
  {
    indicatorCode: "1.1.1",
    title: "Curriculum mapping with vision & mission of the University, School & Department and core values of the University",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.1_Template.xlsx",
    requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "The curriculum is fully aligned with the vision, all mission & core values with the coverage of 100%." },
      veryGood: { score: 3, description: "The curriculum is mostly aligned with vision, all mission & core values with the coverage >=80%." },
      satisfactory: { score: 2, description: "The curriculum is partially aligned with vision, all mission & core values with the coverage >=60%." },
      needsImprovement: { score: 1, description: "The curriculum is rarely aligned with vision, all mission & core values with the coverage >=50%." },
      notSatisfactory: { score: 0, description: "The curriculum does not exhibit any alignment with the vision, all mission and core values with coverage<50%." }
    },
    guidelines: {
      text: [
        "1.Documents pertaining vision & mission and core values of the University, School & Department.",
        "2.Dissemination of vision,mission and core values statements",
        "3.Justification table with all supporting proofs"
      ],
      formula: "% alignment= (no. of elements mapped/total elements(=7) *100",
      remarks: "* Total elements =7: Vision and mission of the University, School & Department and core values of university. For Schools with more than one department, Average score of the percentage alignment will be considered."
    }
  },
  {
    indicatorCode: "1.1.2",
    title: "Curriculum alignment with SDGs",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.2_Template.xlsx",
    requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Curriculum covering >=8 SDGs" },
      veryGood: { score: 3, description: "Curriculum covering >=6 SDGs" },
      satisfactory: { score: 2, description: "Curriculum covering >=4 SDGs" },
      needsImprovement: { score: 1, description: "Curriculum covering >=1 SDGs" },
      notSatisfactory: { score: 0, description: "No mapping" }
    },
    guidelines: {
      text: [
        "Justification table with all supporting proofs"
      ],
      formula: "No. of SDGs Mapped",
      remarks: "Unique SDG mapped with course content is 30% or above will be considered. Average score of all program will be the final score."
    }
  },
  {
    indicatorCode: "1.1.3",
    title: "Global and National Curriculum Alignment & Standardization",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Benchmarked with both national & international standards" },
      veryGood: { score: 3, description: "Benchmarked with international standards" },
      satisfactory: { score: 2, description: "Benchmarked with national standards" },
      needsImprovement: { score: 1, description: "Initiated the process of benchmarking" },
      notSatisfactory: { score: 0, description: "No mapping" }
    },
    guidelines: {
      text: [
        "1.Curriculum benchmarked with National and international Universities with Action Taken.",
        "a. List of Referred National/International University.",
        "b. Key features of mapping Credit Structure, Course Content, Assessment Methods, Skill-Based Learning,    Research & Innovation Focus, Lab equipment, Global Best Practices.",
        "2.NEP 2020 benchmarking of Curriculum- Program Structure."
      ],
    }
  },
  {
    indicatorCode: "1.1.4",
    title: "Percentage of Program Revision",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=70%" },
      veryGood: { score: 3, description: ">=50%" },
      satisfactory: { score: 2, description: ">=30%" },
      needsImprovement: { score: 1, description: ">=10%" },
      notSatisfactory: { score: 0, description: "< 10%" }
    },
    guidelines: {
      text: [
        "1.Curriculum benchmarked with National and international Universities with Action Taken.",
        "a. List of Referred National/International University.",
        "b. Key features of mapping Credit Structure, Course Content, Assessment Methods, Skill-Based Learning,    Research & Innovation Focus, Lab equipment, Global Best Practices.",
        "2.NEP 2020 benchmarking of Curriculum- Program Structure."
      ],
      formula: "(No. of programs revised / Total no. of programs offered in that AY)* 100",
      remarks: " Courses with atleast 20% of the curriculum update shall only be counted program revision more than 20% will be counted. SSS survey to be included for student feedback."
    }
  },
  {
    indicatorCode: "1.1.5",
    title: "Percentage of courses having focus on employability, entrepreneurship and skill development",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=75%" },
      veryGood: { score: 3, description: ">=60%" },
      satisfactory: { score: 2, description: ">=40%" },
      needsImprovement: { score: 1, description: ">=20%" },
      notSatisfactory: { score: 0, description: "< 20%" }
    },
    guidelines: {
      text: [
        " 1.List of courses having focus on employability, entrepreneurship and skill development.",
        " 2.Program Booklet highlighting the course content having focus on employability, entrepreneurship and skill development"
      ],
      formula: " (No. of courses having focus on employability, skill development and entrepreneurship in an AY/Total no. of courses in that AY)*100",
    }
  },
  {
    indicatorCode: "1.1.6",
    title: "Percentage of new courses added",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=20%" },
      veryGood: { score: 3, description: ">=15%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: "<10%" },
      notSatisfactory: { score: 0, description: "No new course added" }
    },
    guidelines: {
      text: [
        "1. List of new added courses.",
        "2. Departmental specific MOMs pertaining to the new courses added based on the feedback received from different stakeholders.",
        "3. Sample Filled feedback form from different stakeholders for curriculum design & development (Alumni, Student, faculty & Employer).",
        "4. Board of Studies and Academic council approved MOMs.",
        "5. Program Booklets highlighting the new added courses."
      ],
      formula: " (No. of new courses added in an AY/Total no. of courses in that AY)*100",
    }
  },
  {
    indicatorCode: "1.1.7",
    title: "Value added courses (CAY)",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.7_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=5" },
      veryGood: { score: 3, description: ">=4" },
      satisfactory: { score: 2, description: ">=3" },
      needsImprovement: { score: 1, description: "1-2" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of VACs added.",
        " 2.Notification pertaining to addition of VACs.",
        " 3.List of students opting VACs.",
        " 4.VAC course files Brochure, Timetable, list of students, Course content, attendance sheet, assessment, Certificate)."
      ],
      formula: "Count of VACs as mentioned in rubrics",
    }
  },
  {
    indicatorCode: "1.1.8",
    title: "No. of knowledge partners associated with School offering academic programs",
    criterionCode: "1",
    subCriterionCode: "1.1",
    templateFileKey: "templates/1.1.8_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">3" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of Programs offered through knowledge partners.",
        " 2.Proofs of active MOUs highlighting the scope of the deliverables in the respective program.",
        " 3.Details of Trainers(Resume, proof of Allocation of courses by knowledge partners, Time table, I- Card issued by the University, ERP  credentials)."
      ],
    }
  },

  // --- Sub-Criteria 1.2: PEDAGOGICAL INNOVATION [cite: 141]
  {
    indicatorCode: "1.2.1",
    title: "Number of Innovative Teaching pedagogies implemented",
    criterionCode: "1",
    subCriterionCode: "1.2",
    templateFileKey: "templates/1.2.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=10" },
      veryGood: { score: 3, description: "8-10" },
      satisfactory: { score: 2, description: "5-7" },
      needsImprovement: { score: 1, description: "1-4" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of Innovative pedagogies",
        " 2.Reports of all courses involving mentioned pedagogies including outcome targeted and achieved"
      ],
    }
  },
  {
    indicatorCode: "1.2.2",
    title: "Initiatives for Slow and Advance learners",
    criterionCode: "1",
    subCriterionCode: "1.2",
    templateFileKey: "templates/1.2.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Different support initiatives implemented with regular assessment, impact analysis, feedback, and action taken reports documented" },
      veryGood: { score: 3, description: "Different support initiatives implemented with regular assessment, impact analysis, with and action taken reports documented but no feedback." },
      satisfactory: { score: 2, description: "Different support initiatives implemented with regular assessment and action taken reports documented but no impact analysis and feedback" },
      needsImprovement: { score: 1, description: "Support initiatives exist but lack structured assessment, impact analysis, feedback, or action taken reports. Processes are inconsistent and not well-documented." },
      notSatisfactory: { score: 0, description: "No support initiatives are implemented, or there is no documented evidence of any assessment, impact analysis, feedback, or action taken reports." }
    },
    guidelines: {
      text: [
        "1.List of Slow and Advanced Learners",
        "2.Report of initiatives taken including regular assessments, impact analysis and feedback.",
        " 3. MoMs with Action taken reports"
      ],
      remarks: "The reports adhering the templates will be considered for scoring"
    }
  },
  {
    indicatorCode: "1.2.3",
    title: "Teaching Learning Initiatives for supporting students from diversed Regional background (both national & international)",
    criterionCode: "1",
    subCriterionCode: "1.2",
    templateFileKey: "templates/1.2.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Initiatives taken by the department in support for students from diverse regional background, outcome achieved and feedback from students" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "Initiatives taken by the department in support for students from diverse Regional background and outcome achieved but no feedback from students available" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No Initiative taken by the Department" }
    },
    guidelines: {
      text: [
        "1.List of Students",
        "2.Reports with relevant proofs showing the support and initiatives taken",
        "3.Outcome achieved ",
        "4.Feedback from students"
      ],
    }
  },

  // --- Sub-Criteria 1.3: DIGITIZATION [cite: 145]
  {
    indicatorCode: "1.3.1",
    title: "Percentage of students completed online courses through MOOC Platform (SWAYAM/NPTEL/ LinkedIn) beyond graduation requirements",
    criterionCode: "1",
    subCriterionCode: "1.3",
    templateFileKey: "templates/1.3.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=80%" },
      veryGood: { score: 3, description: ">=60%" },
      satisfactory: { score: 2, description: ">=40%" },
      needsImprovement: { score: 1, description: ">=20%" },
      notSatisfactory: { score: 0, description: "<20%" },
    },
    guidelines: {
      text: [
        "List of Students with  details of certification along with Certificate"
      ],
      formula: "(No. of students certified /Total no. of students [excluding 1st year])*100",
      remarks: "First year students not to be considered."
    }
  },
  {
    indicatorCode: "1.3.2",
    title: "Use of ICT-enabled tools (LMS, e-resources, simulations, V-Lab etc)",
    criterionCode: "1",
    subCriterionCode: "1.3",
    templateFileKey: "templates/1.3.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Content of 80% and above courses is published on ERP with minimum 25% course content self created with plagiarism report, various ICT enabled tools used and documentation as per the required template" },
      veryGood: { score: 3, description: "Content of 70% and above courses is published on ERP with minimum 25% course content self created with plagiarism report, various ICT enabled tools used and documentation as per the required template" },
      satisfactory: { score: 2, description: "Content of 60% and above courses is published on ERP with minimum 25% course content self created with plagiarism report, various ICT enabled tools used and documentation as per the required template" },
      needsImprovement: { score: 1, description: "Content of 50% and above courses is published on ERP with minimum 25% course content self created, various ICT enabled tools used and documentation as per the required template" },
      notSatisfactory: { score: 0, description: "Content of less than 50% courses is published on ERP with minimum 25% course content self created with plagiarism report, various ICT enabled tools used and documentation as per the required template" },
    },
    guidelines: {
      text: [
        "Proper documented report including links to all online contents designed"
      ],
      formula: " (No. of courses with content uploaded on ERP/Total no. of courses)*100",
    }
  },

  // --- Sub-Criteria 1.4: CONTINUOUS ASSESSMENT METHODOLOGY [cite: 148]
  {
    indicatorCode: "1.4.1",
    title: "Evaluation of Continuous Assessment: Assignments, Tests, Mid-Term, etc.",
    criterionCode: "1",
    subCriterionCode: "1.4",
    templateFileKey: "templates/1.4.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Well-defined BOS-approved CAPS, comprehensive result analysis, and detailed action taken reports are available in 100% of course files" },
      veryGood: { score: 3, description: "BOS-approved CAPs, result analysis, and action taken reports are available in >=85% of course files" },
      satisfactory: { score: 2, description: "BOS-approved CAPs and result analysis reports exist in >=70% of course files, but action taken reports are not well-defined" },
      needsImprovement: { score: 1, description: "BOS-approved CAPs and result analysis reports exist in >=50% of course files, but action taken reports are either missing or not well-defined" },
      notSatisfactory: { score: 0, description: "CAPs, result analysis, and action taken reports are available in less than 50% of course files, with significant gaps in documentation and implementation" },
    },
    guidelines: {
      text: [
        "1.Course Files",
        "2.CAPs approved in BoS"
      ],
    }
  },
  {
    indicatorCode: "1.4.2",
    title: "Internship/Industrial training and Project Evaluation as per scheme",
    criterionCode: "1",
    subCriterionCode: "1.4",
    templateFileKey: "templates/1.4.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Well defined rubrics, 100% certificates or project reports available" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "Less than 100% certificates or reports available" },
    },
    guidelines: {
      text: [
        "1.Rubrics for Project Evaluation & Industrial Training.",
        "2.Certificates of all students.",
        "3.Project/ Industrial Training Reports."
      ],
      formula: " (No. of certificates/ Total no. of eligible students undergoing interships/project)*100",
    }
  },

  // --- Sub-Criteria 1.5: PERFORMANCE AND EVALUATION ANALYSIS [cite: 151]
  {
    indicatorCode: "1.5.1",
    title: "Number of Students eligible for the exam",
    criterionCode: "1",
    subCriterionCode: "1.5",
    templateFileKey: "templates/1.5.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<=50%" },
    },
    guidelines: {
      text: [
        "List of the students eligible verfiied from Examination Cell."
      ],
      formula: " (No. of students elgible /total no. of students) *100"
    }
  },
  {
    indicatorCode: "1.5.2",
    title: "Pass percentage/ Completion Rate",
    criterionCode: "1",
    subCriterionCode: "1.5",
    templateFileKey: "templates/1.5.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<=50%" },
    },
    guidelines: {
      text: [
        "List of the students passed verified from Examination Cell."
      ],
      formula: "(No. of students passed /total no. of students)*100",
    }
  },

  // --- Sub-Criteria 1.6: ATTAINMENT OF COURSE OUTCOMES [cite: 154]
  {
    indicatorCode: "1.6.1",
    title: "Program Articulation Matrix",
    criterionCode: "1",
    subCriterionCode: "1.6",
    templateFileKey: "templates/1.6.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        " Well defined Articulation Matrix as per the template(in OBE Manual)"
      ],
    }
  },
  {
    indicatorCode: "1.6.2",
    title: "Assessment methods and processes contributing to attainment of COs being followed",
    criterionCode: "1",
    subCriterionCode: "1.6",
    templateFileKey: "templates/1.6.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        "Proper documented reports as per the template (in OBE Manual)"
      ],
    }
  },
  {
    indicatorCode: "1.6.3",
    title: "Direct and indirect Attainment of Course Outcomes of all Courses with Respect to Set Attainment Targets",
    criterionCode: "1",
    subCriterionCode: "1.6",
    templateFileKey: "templates/1.6.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "CO Targets of >=80% courses attained" },
      veryGood: { score: 3, description: "CO Targets of >=70% courses attained" },
      satisfactory: { score: 2, description: "CO Targets of >=60% courses attained" },
      needsImprovement: { score: 1, description: "CO Targets of >=50% courses attained" },
      notSatisfactory: { score: 0, description: "CO Targets of <50% courses attained" },
    },
    guidelines: {
      text: [
        " 1.CO - Attainment reports for all courses(in OBE manual)"
      ],
      formula: "(No. of courses with targets of all COs attained/total no. of courses)*100",
    }
  },
  {
    indicatorCode: "1.6.4",
    title: "Overall attainment of Program Outcomes and Program Specific Outcomes & ATR",
    criterionCode: "1",
    subCriterionCode: "1.6",
    templateFileKey: "templates/1.6.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Overall PO attainment target of >=80% PO's/PSO's attained and continuous improvement strategies are in place" },
      veryGood: { score: 3, description: "Overall PO attainment target of >=70% PO's/PSO's attained and action taken reports are well defined" },
      satisfactory: { score: 2, description: "Overall PO attainment target of >=60% PO's/PSO's attained but action taken reports are not well-defined" },
      needsImprovement: { score: 1, description: "Overall PO attainment target of >=50% PO's/PSO's attained and but action taken reports are either missing or not well-defined" },
      notSatisfactory: { score: 0, description: "Overall PO attainment target of <50% of the PO's/PSO's was attained with significant gaps in documentation and implementation" },
    },
    guidelines: {
      text: [
        "1.PO attainment report for all programs",
        "2.Action Taken Report (in OBE Manual)"
      ],
      formula: "(No. of POs &PSOs of target attained)/Total no. of POs & PSOs) *100"
    }
  },

  // =======================================================================
  // CRITERIA 2: RESEARCH, INNOVATION & IMPACT [cite: 186]
  // =======================================================================

  // --- Sub-Criteria 2.1: RESEARCH PUBLICATIONS [cite: 187]
  {
    indicatorCode: "2.1.1",
    title: "Number of research papers published in SCI/eSCI/SCIE/Scopus/WOS/ABDC/EBSCO/ EQUIVALENT (per faculty)",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/2.1.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">3" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Total Number of Paper Published",
        " 2. Title of the Paper",
        " 3.Author’s Name",
        " 4.Name of the Journal",
        " 5.National/International",
        " 6.Category (SCI/SCOPUS/EBSCO/ABDC)",
        " 7.Year of Publication",
        " 8.Journal Link",
        " 9.DOI Link"
      ],
      formula: "(Total number of paper published in the assessment year/Total number of faculty members)",
      remarks: "Only with MRU Affiliation. Author with MRU Affiliation should be in Bold."
    }
  },
  {
    indicatorCode: "2.1.2",
    title: "Number of Conference Paper Published in Scopus Indexed proceedings (per faculty)",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/2.1.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">3" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Title of the Paper",
        " 2.Author’s Name with affiliation",
        " 3.Details of the Conference (Brochure) ",
        " 4.Proof of Conference Proceedings",
        " 5.Year of Publication",
        " 6.ISBN/ISSN Number of the Conference Proceedings",
        " 7.Name of the Publisher"
      ],
      formula: " (Total number of Conference paper published in the assessment year /Total number of faculty members)",
      remarks: "Only with MRU Affiliation. Author with MRU Affiliation should be in Bold."
    }
  },
  {
    indicatorCode: "2.1.3",
    title: "Number of Edited/Published Book and Book Chapters (per faculty)",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/2.1.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=1" },
      veryGood: { score: 3, description: ">=0.75" },
      satisfactory: { score: 2, description: ">=0.5" },
      needsImprovement: { score: 1, description: ">=0.25" },
      notSatisfactory: { score: 0, description: "<0.25" }
    },
    guidelines: {
      text: [
        " 1.Title of the Book/ Book Chapter",
        " 2.Author’s Name with affiliation",
        " 3.Name of the Publisher",
        " 4.Table of Contents of Book (Highlighting the chapter)",
        " 5.Cover Page of the Book / First Page of Book Chapter",
        " 6.Category (SCI/SCOPUS/EBSCO/ABDC etc)",
        " 7.Year of Publication",
        " 8.ISBN/ISSN Number",
        " 9.DOI Link"
      ],
      formula: " (Total number of book chapters published in the assessment year/Total number of faculty members)",
    }
  },
  {
    indicatorCode: "2.1.4",
    title: "Median value of citations - Google",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/No_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=50" },
      veryGood: { score: 3, description: ">=30" },
      satisfactory: { score: 2, description: ">=20" },
      needsImprovement: { score: 1, description: ">=10" },
      notSatisfactory: { score: 0, description: "<10" }
    },
    guidelines: {
      text: [
        " 1.Google Scholar citation to be mentioned in Data template 4.1"
      ],
      formula: " Total number of citations for the school/ Total number of paper"
    }
  },
  {
    indicatorCode: "2.1.5",
    title: "H-index of the researcher",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/No_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">75% of the faculty members with citation index >5" },
      veryGood: { score: 3, description: "51-75% of the faculty members with citation index >5" },
      satisfactory: { score: 2, description: "26-50% of the faculty members with citation index >5" },
      needsImprovement: { score: 1, description: "10-25% of the faculty members with citation index >5" },
      notSatisfactory: { score: 0, description: "<10% of the faculty members with citation index>5" }
    },
    guidelines: {
      text: [
        " 1.Google Scholar h-index report to be mentioned in 4.1"
      ],
    }
  },
  {
    indicatorCode: "2.1.6",
    title: "Research Seminars/Workshop/Training programs organized on IPR, Research Methodology etc.",
    criterionCode: "2",
    subCriterionCode: "2.1",
    templateFileKey: "templates/2.1.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: [
      "1.Approval letter",
      "2.Invitation mail",
      "3.Notice",
      "4.Flyer of seminars/ workshop/ training with SDG mapping",
      "5.Detail of the resource person",
      "6.Attendance of the participants",
      "7.Events reports along with geotag photographs and captions",
      "8.Feedback",
      "9.Certification"
    ]
  },

  // --- Sub-Criteria 2.2: PATENTS [cite: 194]
  {
    indicatorCode: "2.2.1",
    title: "Number of patents published with MRU affiliation",
    criterionCode: "2",
    subCriterionCode: "2.2",
    templateFileKey: "templates/2.2.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=5" },
      veryGood: { score: 3, description: ">=4" },
      satisfactory: { score: 2, description: ">=3" },
      needsImprovement: { score: 1, description: ">=2" },
      notSatisfactory: { score: 0, description: "<1" }
    },
    guidelines: {
      text: [
        " 1.List of patents published (Patent Title, Application Number, Faculty Name, Date of Publication).",
        " 2.Patent Status Report",
        " 3.Official Gazette Notification of the published patent."
      ],
      formula: "(Total number of patents/Total number of faculty members)"
    }
  },
  {
    indicatorCode: "2.2.2",
    title: "Number of patents granted with MRU affiliation",
    criterionCode: "2",
    subCriterionCode: "2.2",
    templateFileKey: "templates/2.2.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of granted patents (Patent Title, Grant Number, Faculty Name, Date of Grant).",
        " 2.Patent Status Report",
        " 3.Patent Grant Certificate."
      ],
      formula: "(Total number of patents/Total number of faculty members)"
    }
  },
  {
    indicatorCode: "2.2.3",
    title: "Commercialized patents",
    criterionCode: "2",
    subCriterionCode: "2.2",
    templateFileKey: "templates/2.2.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" }
    },
    guidelines: {
      text: [
        " 1.List of commercialized patents (Patent Title, Faculty Name, Commercialization Partner, Revenue Details).",
        " 2.MoUs or agreements with commercialization partners."
      ],
    }
  },

  // --- Sub-Criteria 2.3: RESEARCH GRANTS/PROJECTS [cite: 198]
  {
    indicatorCode: "2.3.1",
    title: "Number of new project proposals submitted",
    criterionCode: "2",
    subCriterionCode: "2.3",
    templateFileKey: "templates/2.3.1_Template.xlsx",
     requiresEvidenceLink: true,
    // NOTE: This has sub-categories in the PDF, which we simplify for the title.
    rubric: {
      excellent: { score: 4, description: ">=5 (STEM), >=60% (Non-STEM)" },
      veryGood: { score: 3, description: "4 (STEM), 3 (Non-STEM)" },
      satisfactory: { score: 2, description: "3 (STEM), 2 (Non-STEM)" },
      needsImprovement: { score: 1, description: "1-2 (STEM), 1 (Non-STEM)" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.List of New research proposals (Title, Name of Principal Investigator & Co-PI, Funding Agency, Amount).",
        "2.Submission receipts or Acknowledgement numbers "
      ],
    }
  },
  {
    indicatorCode: "2.3.2",
    title: "Grant received through Govt./Non Govt./Industry/ Institution in the CFY (INR Lakhs)",
    criterionCode: "2",
    subCriterionCode: "2.3",
    templateFileKey: "templates/2.3.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Varies by source and STEM/Non-STEM" },
      veryGood: { score: 3, description: "Varies by source and STEM/Non-STEM" },
      satisfactory: { score: 2, description: "Varies by source and STEM/Non-STEM" },
      needsImprovement: { score: 1, description: "Varies by source and STEM/Non-STEM" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.List of funded projects (Title, Principal Investigator & Co-PI, Amount Sanctioned, Funding Agency).",
        "2.Grant sanction letters or approval documents.",
        "3.Project Status Report"
      ],
    }
  },
  {
    indicatorCode: "2.3.3",
    title: "Number of Faculty mentoring projects",
    criterionCode: "2",
    subCriterionCode: "2.3",
    templateFileKey: "templates/2.3.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Varies by source" },
      veryGood: { score: 3, description: "Varies by source" },
      satisfactory: { score: 2, description: "Varies by source" },
      needsImprovement: { score: 1, description: "Varies by source" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of faculty mentoring research projects. (Title, Principal Investigator & CO-PI, Amount Sanctioned, Funding Agency)",
        " 2.Project reports with faculty guidance details."
      ],
    }
  },
  {
    indicatorCode: "2.3.4",
    title: "Students involved in projects",
    criterionCode: "2",
    subCriterionCode: "2.3",
    templateFileKey: "templates/2.3.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        " 1.List of students involved in projects (Name, Project Title, Faculty Mentor).",
        " 2.Signed project reports/Status Report"
      ],
    }
  },

  // --- Sub-Criteria 2.4: CONSULTANCY AND MDPS [cite: 201]
  {
    indicatorCode: "2.4.1",
    title: "Number of Consultancy/ MDP Assignments",
    criterionCode: "2",
    subCriterionCode: "2.4",
    templateFileKey: "templates/2.4.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of consultancy/MDP assignments (Title, Faculty Coordinator, Client Details, Date, Amount).",
        " 2.MoUs or agreements with clients."
      ],
    }
  },
  {
    indicatorCode: "2.4.2",
    title: "Revenue generated through Consultancy/MDPs (INR Lakhs)",
    criterionCode: "2",
    subCriterionCode: "2.4",
    templateFileKey: "templates/2.4.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">15" },
      veryGood: { score: 3, description: ">=11" },
      satisfactory: { score: 2, description: ">=6" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Financial receipts or invoices.",
        " 2.Revenue statements from the finance department."
      ],
    }
  },

  // --- Sub-Criteria 2.5: START-UPS [cite: 204]
  {
    indicatorCode: "2.5.1",
    title: "Percentage of students involved in startups",
    criterionCode: "2",
    subCriterionCode: "2.5",
    templateFileKey: "templates/2.5.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=0.5%" },
      veryGood: { score: 3, description: "0.5-0.26%" },
      satisfactory: { score: 2, description: "0.15-0.25%" },
      needsImprovement: { score: 1, description: "<0.15%" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        "List of student members of the Innovation & Incubation Cell endorsed by IIC."
      ],
    }
  },
  {
    indicatorCode: "2.5.2",
    title: "Number of Faculty mentoring startups",
    criterionCode: "2",
    subCriterionCode: "2.5",
    templateFileKey: "templates/2.5.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of faculty mentoring startups.(Title, Faculty Coordinator, Funding Agency, Amount)",
        " 2.Project details and mentorship reports."
      ],
    }
  },
  {
    indicatorCode: "2.5.3",
    title: "Incubated startups by students",
    criterionCode: "2",
    subCriterionCode: "2.5",
    templateFileKey: "templates/2.5.3_Template.xlsx",
     requiresEvidenceLink: true,
    requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes (if DPIIT registered)" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "Yes (if not registered on DPIIT)" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" }
    },
    guidelines: {
      text: [
        "1.List of student- incubated startups (Startup Name, Founder(s), DPIITRegistration Number).",
        "2.DPIIT registration certificates."
      ],
    }
  },

  // --- Sub-Criteria 2.6: RESEARCH INFRASTRUCTURE [cite: 208]
  {
    indicatorCode: "2.6.1",
    title: "Outcome of labs and Centre of Excellence for research",
    criterionCode: "2",
    subCriterionCode: "2.6",
    templateFileKey: "templates/2.6.1_Template.xlsx",
    requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "All of the above mentioned outcomes achieved" },
      veryGood: { score: 3, description: "Three of the mentioned outcomes achieved" },
      satisfactory: { score: 2, description: "Two of the mentioned outcomes achieved" },
      needsImprovement: { score: 1, description: "One of the mentioned outcomes achieved" },
      notSatisfactory: { score: 0, description: "No Outcome achieved" }
    },
    guidelines: {
      text: [
        " 1.Reports on research activities conducted in labs/CoE",
        " 2.List of patents/ publications/ funded projects originating from these labs"
      ],
    }
  },
  {
    indicatorCode: "2.6.2",
    title: "Active MoUs with organizations /industry",
    criterionCode: "2",
    subCriterionCode: "2.6",
    templateFileKey: "templates/2.6.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=8" },
      veryGood: { score: 3, description: ">=6" },
      satisfactory: { score: 2, description: ">=4" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.List of Active MOU",
        " 2.Details of the partners/organisation with which MOU has been signed",
        " 3.Signed copy of MoU",
        " 4.List of collaborative "
      ],
    }
  },

  // --- Sub-Criteria 2.7: INTERDISCIPLINARY RESEARCH [cite: 211]
  {
    indicatorCode: "2.7.1",
    title: "Percentage of publications highlighting interdisciplinary research",
    criterionCode: "2",
    subCriterionCode: "2.7",
    templateFileKey: "templates/2.7.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=30%" },
      veryGood: { score: 3, description: ">=20%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: ">=1%" },
      notSatisfactory: { score: 0, description: "No Data" }
    },
    guidelines: {
      text: [
        " Data input sheet 2.1.1"
      ],
      formula: " (Number of Interdisciplinary Publication/Total Number of Publication)"
    }
  },
  {
    indicatorCode: "2.7.2",
    title: "Percentage of Interdisciplinary Research projects/ Consultancy/ MDP assignments",
    criterionCode: "2",
    subCriterionCode: "2.7",
    templateFileKey: "templates/2.7.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=30%" },
      veryGood: { score: 3, description: ">=20%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: ">=1%" },
      notSatisfactory: { score: 0, description: "No Data" }
    },
    guidelines: {
      text: [
        "Data input sheet 2.3, 2.4"
      ],
      formula: " (Number of Interdisciplinary Projects/ Consultancy/ Total number of Projects)"
    }
  },

  // --- Sub-Criteria 2.8: PH.D. PROGRAM [cite: 214]
  {
    indicatorCode: "2.8.1",
    title: "Number of Active Doctoral Scholars (Full-time/Part-time) in the CAY",
    criterionCode: "2",
    subCriterionCode: "2.8",
    templateFileKey: "templates/2.8.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100% seats filled against the vacancies available." },
      veryGood: { score: 3, description: ">=80% seats filled against the vacancies available." },
      satisfactory: { score: 2, description: ">=60%seats filled against the vacancies available." },
      needsImprovement: { score: 1, description: ">=40%seats filled against the vacancies available." },
      notSatisfactory: { score: 0, description: "< 40% seats filled against the vacancies available." }
    },
    guidelines: {
      text: [
        "Details of seats filled against the vacancies available in the CAY verified from Ph.D. office."
      ],
      formula: "(Active scholars/ No. of vacancies) *100"
    }
  },
  {
    indicatorCode: "2.8.2",
    title: "Percentage of scholars awarded a doctoral degree out of the active scholars",
    criterionCode: "2",
    subCriterionCode: "2.8",
    templateFileKey: "templates/2.8.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=15%" },
      veryGood: { score: 3, description: ">=10%" },
      satisfactory: { score: 2, description: ">=5%" },
      needsImprovement: { score: 1, description: ">=1%" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Number of  Ph.D. degree awarded till CAY—3",
        " 2.List of active scholars till CAY—3",
        " 3.Thesis title",
        " 4. Name of the Scholars",
        " 5.Name of the Supervisor & Co-Supervisor",
        " 6.Degree award notification",
        " 7.Ph.D. certificate"
      ],
      formula: "(Number of degrees awarded for scholars excluding last 3 years of active scholars/Total no. of active scholars excluding last 3 years of active scholars)*100"
    }
  },

  // =======================================================================
  // CRITERIA 3: STUDENT LIFECYCLE & ENGAGEMENT [cite: 237]
  // =======================================================================

  // --- Sub-Criteria 3.1: ADMISSION [cite: 238]
  {
    indicatorCode: "3.1.1",
    title: "Percentage of admisison against sanctioned seats",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        " 1.Details for the sanctioned seats(Brochure screenshot)",
        " 2.Database of eligible admission application received "
      ],
      formula: "(Number of admitted students/number of Sanctioned Seats)*100"
    }
  },
  {
    indicatorCode: "3.1.2",
    title: "Regional Diversity",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "No marking" },
    },
    guidelines: {
      text: [
        " 1.List of Students as per template",
        " 2.Aadhar Card/ Marksheet/ certificate/ 10th Domicile Passport for Domicile Verification."
      ],
    }
  },
  {
    indicatorCode: "3.1.3",
    title: "Gender ratio of students",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "No marking" },
    },
    guidelines: {
      text: [
        " 1.List of Students as per template",
        " 2.Aadhar Card/10th Marksheet/Domicile certificate/ Passport for Domicile Verification."
      ],
    }
  },
  {
    indicatorCode: "3.1.4",
    title: "Students admitted through JEE/GATE/CLAT/CAT/MAT/CUET",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "30%" },
      veryGood: { score: 3, description: "20%" },
      satisfactory: { score: 2, description: "10%" },
      needsImprovement: { score: 1, description: "5%" },
      notSatisfactory: { score: 0, description: "<5%" },
    },
    guidelines: {
      text: [
        " Score card of student admitted through JEE/ GATE/ CLAT/ MAT/ CUET/MRNAT exam"
      ],
      formula: " (Number of students admitted through competitive exam/total number of admitted students)*100"
    }
  },
  {
    indicatorCode: "3.1.5",
    title: "Initiatives taken for specially abled students",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "No marking" },
    },
    guidelines: {
      text: [
        " 1.Student MRU ID Card",
        " 2.Student Medical Card",
        " 3.Details of Support provided along with relevant Proof"
      ],
    }
  },
  {
    indicatorCode: "3.1.6",
    title: "Number of students availing scholarship/fee waiver",
    criterionCode: "3",
    subCriterionCode: "3.1",
    templateFileKey: "templates/3.1.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=30%" },
      veryGood: { score: 3, description: ">=20%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: ">=5%" },
      notSatisfactory: { score: 0, description: "<5%" },
    },
    guidelines: {
      text: [
        " 1.List of students availing scholarship",
        " 2.Amount of scholarship",
        " 3.Type of scholarship",
        " 4.Office order from Registrar office awarding scholarship/fee waiver or any government body"
      ],
      formula: "(Number of student savailing fee waiver/Number of eligible students)*100"
    }
  },

  // --- Sub-Criteria 3.2: INDUCTION PROGRAM FOR STUDENTS [cite: 245]
  {
    indicatorCode: "3.2.1",
    title: "Induction Program for students",
    criterionCode: "3",
    subCriterionCode: "3.2",
    templateFileKey: "templates/3.2.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Orientation schedule and communication through multiple channels. Comprehensive report covering all the activities, students feedback and key takeaways along with 90% and above students attendance." },
      veryGood: { score: 3, description: "Major events are included in the report but lack of student feedback and key learning along with 75-89% student attendance." },
      satisfactory: { score: 2, description: "Major events are not highlighted properly. Photographs and key insights are missing along with 65-74% student attendance" },
      needsImprovement: { score: 1, description: "Very brief and poorly structured induction report is available along with 50-64% student's attendance." },
      notSatisfactory: { score: 0, description: "No reports have been submitted along with less than 50% student's attendance." },
    },
    guidelines: {
      text: [
        " 1.Induction schedule",
        " 2.Induction Report with Photographs",
        " 3.Student attendance record",
        " 4.Absentees list and reason",
        " 5.Feedback"
      ],
    }
  },
  {
    indicatorCode: "3.2.2",
    title: "Faculty Student Ratio",
    criterionCode: "3",
    subCriterionCode: "3.2",
    templateFileKey: "templates/3.2.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "1:10" },
      veryGood: { score: 3, description: "1:15" },
      satisfactory: { score: 2, description: "1:20" },
      needsImprovement: { score: 1, description: "1:25" },
      notSatisfactory: { score: 0, description: "Above 1:25" },
    },
    guidelines: {
      text: [
        " 1.List of full time faculty members",
        " 2.List of enrolled students",
        " 3.Student intake"
      ],
      formula: "Number of Faculty/ Number of Sanctioned Students"
    }
  },

  // --- Sub-Criteria 3.3: IMPLEMENTATION OF MENTOR-MENTEE [cite: 248]
  {
    indicatorCode: "3.3.1",
    title: "Mentor-Mentee Engagement",
    criterionCode: "3",
    subCriterionCode: "3.3",
    templateFileKey: "templates/3.3.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Regular planned meeting of mentor mentee (at least once in a month) along with their MOM and Action Taken Report with other relevant documents." },
      veryGood: { score: 3, description: "Regular meetings are planned with little bit delay(1 meeting in two months). MOM and Mentor-Mentee file is available with relevant information." },
      satisfactory: { score: 2, description: "Meeting once or twice in semester with brief documentations in mentor-mentee files." },
      needsImprovement: { score: 1, description: "Meetings are very irregular without prior plannings with lack of documentations." },
      notSatisfactory: { score: 0, description: "No structured meetings were planned in the semester. Mentor-Mentee file is missing." },
    },
    guidelines: {
      text: [
        " 1.Office order of List of mentors along with assigned mentees",
        " 2.Mentor-Mentee meeting schedules",
        " 3.Minutes of Meetings Mentor Mentee along with Attendance sheet and geo tag photographs",
        " 4.Student Feedback",
        " 5.Mentoring report for any special Counselling case (If any)",
        " 6.Minutes of Meeting of HoDs and Mentors along with Attendance sheet and geo tag photographs"
      ],
    }
  },
  {
    indicatorCode: "3.3.2",
    title: "Grievances Handling Method",
    criterionCode: "3",
    subCriterionCode: "3.3",
    templateFileKey: "templates/3.3.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Well defined and publicized system... action taken within 24-48 hours and the grievance has been closed. 100% Cases are solved." },
      veryGood: { score: 3, description: "Well defined and publicized system... action taken within 3-5 days and the grievance has been closed. 75% Cases are solved." },
      satisfactory: { score: 2, description: "Well defined and publicized system... action taken within 7-10 days and the grievance has not been closed. 50% are solved." },
      needsImprovement: { score: 1, description: "Well defined and publicized system... action taken within 15 days and the grievance has not been closed. Less than 50% are solved." },
      notSatisfactory: { score: 0, description: "Grievances are not handled" },
    },
    guidelines: {
      text: [
        " 1.Grievance redressal committee documents",
        " 2.Grievance handling policy ",
        " 3.Display of Grievance handling mechanism on notice boards- geo tag photograph",
        " 4.Details of cases reported (online/ offline)",
        " 5.Grievance meeting schedule and their MOM",
        " 6.Closure of the grievance with its report",
        " 7.Proof of the time taken"
      ],
      formula: "Number of Faculty/Number of Sanctioned Students"
    }
  },
  {
    indicatorCode: "3.3.3",
    title: "Preventive Measures for Anti-Ragging and Harassment",
    criterionCode: "3",
    subCriterionCode: "3.3",
    templateFileKey: "templates/3.3.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Dissemination of information and Initiatives taken by the department for student awareness." },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No information dissemination/ Initiatives taken by the department for student awareness." },
    },
    guidelines: {
      text: [
        " 1.Anti-Ragging & Anti-Harassment Policy Document",
        " 2.Code of conduct for students and faculty",
        " 3.Report of the initiatives taken by the school to prevent the ragging",
        " 4.Details of Anti Ragging case if any."
      ],
    }
  },

  // --- Sub-Criteria 3.4: TRAINING/WORKSHOPS/SEMINARS... [cite: 252]
  {
    indicatorCode: "3.4.1",
    title: "Number of technical guest lectures Organized",
    criterionCode: "3",
    subCriterionCode: "3.4",
    templateFileKey: "templates/3.4.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4 (all documents are available)" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        "1.Approval letter",
        "2.Invitation mail",
        "3.Notice",
        "4.Flyer of workshop/training with SDG mapping",
        "5.Detail of the resource person",
        "6.Attendance of the participants",
        "7.Events reports along with geotag photographs and captions",
        "8.Feedback and Action Taken Report",
        "9.Certificates (participation, organisers and volunteering or invitee if alumni)"
      ],
    }
  },
  {
    indicatorCode: "3.4.2",
    title: "Number of workshop and training conducted for students",
    criterionCode: "3",
    subCriterionCode: "3.4",
    templateFileKey: "templates/3.4.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4 (all documents are available)" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Approval letter",
        "2.Invitation mail",
        "3.Notice",
        "4.Flyer of workshop/training with SDG mapping",
        "5.Detail of the resource person",
        "6.Attendance of the participants",
        "7.Events reports along with geotag photographs and captions",
        "8.Feedback and Action Taken Report",
        "9.Certificates (participation, organisers and volunteering)"
      ],
    }
  },
  {
    indicatorCode: "3.4.3",
    title: "Awareness session organized (Gender Sensitization, Health & Hygiene, Human Laws, Yoga etc.)",
    criterionCode: "3",
    subCriterionCode: "3.4",
    templateFileKey: "templates/3.4.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes (along with relevant documents)" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No session organized" }
    },
    guidelines: {
      text: [
        "1.Approval letter",
        "2.Invitation mail",
        "3.Notice",
        "4.Flyer of workshop/training with SDG mapping",
        "5.Detail of the resource person",
        "6.Attendance of the participants",
        "7.Events reports along with geotag photographs and captions",
        "8.Feedback and Action Taken Report",
        "9.Certificates (participation, organisers and volunteering)"
      ],
    }
  },
  {
    indicatorCode: "3.4.4",
    title: "Awareness session organized on Soft Skills, Language and communications skills",
    criterionCode: "3",
    subCriterionCode: "3.4",
    templateFileKey: "templates/3.4.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        "1.Approval letter",
        "2.Invitation mail",
        "3.Notice",
        "4.Flyer of workshop/training with SDG mapping",
        "5.Details of the resource person",
        "6.Attendance of the participants",
        "7.Event reports along with geotag photographs and captions",
        "8.Feedback and Action Taken Report",
        "9.Certificates (participation, organisers and volunteering)"
      ],
    }
  },
  {
    indicatorCode: "3.4.5",
    title: "Competitive exam/Career Counselling guiding sessions by external experts",
    criterionCode: "3",
    subCriterionCode: "3.4",
    templateFileKey: "templates/3.4.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" }
    },
    guidelines: {
      text: [
        " 1.Approval letter",
        "2.Invitation mail",
        "3.Notice",
        "4.Flyer of the Event",
        "5.Details of the resource person",
        "6.Attendance of the participants",
        "7.Event reports along with geotag photographs and captions",
        "8.Feedback and Action Taken Report"
      ],
    }
  },

  // --- Sub-Criteria 3.5: STUDENT CLUBS [cite: 257]
  {
    indicatorCode: "3.5.1",
    title: "Availability of Student clubs/local chapters in the schools",
    criterionCode: "3",
    subCriterionCode: "3.5",
    templateFileKey: "templates/3.5.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        " 1.Office order for the student club formation",
        " 2.List of the student members along with their designations"
      ],
    }
  },
  {
    indicatorCode: "3.5.2",
    title: "Number of Student clubs/ local chapter activities",
    criterionCode: "3",
    subCriterionCode: "3.5",
    templateFileKey: "templates/3.5.2_Template.xlsx",
    rubric: {
      excellent: { score: 4, description: ">=8" },
      veryGood: { score: 3, description: ">=6" },
      satisfactory: { score: 2, description: ">=4" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Notice",
        " 2.Flyer of event with SDG mapping",
        " 3.Detail of the resource person",
        " 4.Attendance of the participants",
        " 5.Event reports along with geotag photographs and captions",
        " 6.Feedback"
      ],
    }
  },
  {
    indicatorCode: "3.5.3",
    title: "Number of Club Participation and Achievement at National/International Levels",
    criterionCode: "3",
    subCriterionCode: "3.5",
    templateFileKey: "templates/3.5.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4 national/ international participation with among top 3 positions at least in two events" },
      veryGood: { score: 3, description: "3 national/ international participation with among top 3 positions at least in one event" },
      satisfactory: { score: 2, description: "2 national/ international participation" },
      needsImprovement: { score: 1, description: "1 national/ international participation" },
      notSatisfactory: { score: 0, description: "No participation" },
    },
    guidelines: {
      text: [
        " 1.Detail of the events at national/international level",
        " 2.Participation or Winning Certificates/Letter/email",
        " 3.Result of the events"
      ],
    }
  },

  // --- Sub-Criteria 3.6: INDUSTRY INTERACTION [cite: 261]
  {
    indicatorCode: "3.6.1",
    title: "Number of industrial visits/field trips organised in Academic Year",
    criterionCode: "3",
    subCriterionCode: "3.6",
    templateFileKey: "templates/3.6.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "No visits" },
    },
    guidelines: {
      text: [
        " 1.Approval letter for the visit",
        " 2.Attendance list of the students",
        " 3.Visit report along with geotag photographs and captions",
        "  4. Feedback"
      ],
    }
  },

  // --- Sub-Criteria 3.7: PLACEMENTS & PROGRESSION [cite: 263]
  {
    indicatorCode: "3.7.1",
    title: "Percentage of students placed/self employed/ going for higher studies",
    criterionCode: "3",
    subCriterionCode: "3.7",
    templateFileKey: "templates/3.7.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        "1.List of students placed/self employed/gone for higher studies with full details",
        " 2.List of total outgoing students",
        " 3.Proof of placement/higher studies/self-employment (offer letter / appointment letter, I card, admission letter, etc.)"
      ],
    }
  },
  {
    indicatorCode: "3.7.2",
    title: "Highest salary", // Combining a and b
    criterionCode: "3",
    subCriterionCode: "3.7",
    templateFileKey: "templates/3.7.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">= 60 LPA (Engg), >=10 LPA (Non-Engg)" },
      veryGood: { score: 3, description: "40-60 LPA (Engg), 8-10 LPA (Non-Engg)" },
      satisfactory: { score: 2, description: "20-40 LPA (Engg), 6-8 LPA (Non-Engg)" },
      needsImprovement: { score: 1, description: "10-20 LPA (Engg), 3-6 LPA (Non-Engg)" },
      notSatisfactory: { score: 0, description: "<10 LPA (Engg), <3 LPA (Non-Engg)" },
    },
    guidelines: {
      text: [
        " 1.Offer letter of the highest salary received both of previous & current year",
        " 2.List of companies visited for placement along with number of students recruited and package offered",
        " 3.List of Top 10 National and International Placements",
        " 4.List of Top 5 recruiter"
      ],
      formula: "(Number of students qualified competitive exam/Number of students appearing for competitive exam)*100"
    }
  },
  {
    indicatorCode: "3.7.3",
    title: "Percentage of Students qualifying competitive exams",
    criterionCode: "3",
    subCriterionCode: "3.7",
    templateFileKey: "templates/3.7.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        "1.List of student appeared in competitive Examination",
        "2.List of student selected or qualified",
        "3.Registration number or roll number for the exam",
        "4.Name of the exam cleared",
        " 5.Admit card of the students",
        " 6.Result card of the students"
      ],
    }
  },
  {
    indicatorCode: "3.7.4",
    title: "Graduation outcome",
    criterionCode: "3",
    subCriterionCode: "3.7",
    templateFileKey: "templates/3.7.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        "1.List of Students graduated as per the Convocation data"
        ],
        formula: "No. of student graduated as per convocation data*100/Sanctioned Intake"
    }
  },

  // --- Sub-Criteria 3.8: INTERNSHIPS [cite: 268]
  {
    indicatorCode: "3.8.1",
    title: "Percentage of students going for internships/in-house projects as per scheme",
    criterionCode: "3",
    subCriterionCode: "3.8",
    templateFileKey: "templates/3.8.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.List of students going on internship /in-house project",
        "2.Offer letter for internship",
        "3.In-house project details",
        "4.Internship completion certificate",
        "5.Front Page and Certificate Page of the Project Report"
      ],
    }
  },
  {
    indicatorCode: "3.8.2",
    title: "Number of students going for paid internships",
    criterionCode: "3",
    subCriterionCode: "3.8",
    templateFileKey: "templates/3.8.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=20" },
      veryGood: { score: 3, description: ">=15" },
      satisfactory: { score: 2, description: ">10" },
      needsImprovement: { score: 1, description: "1-10" },
      notSatisfactory: { score: 0, description: "No paid internships" },
    },
    guidelines: {
      text: [
        "1.List of students going on internship /in-house project",
        "2.Offer letter for internship",
        "3.In-house project details",
        "4.Internship completion certificate",
        "5.Front Page and Certificate Page of the Project Report"
      ],
      formula: " (Number of students going for paid internship/Number of students going for internship)*100"
    }
  },

  // --- Sub-Criteria 3.9: STUDENT CONTRIBUTION [cite: 272]
  {
    indicatorCode: "3.9.1",
    title: "Number of Student publication/patents",
    criterionCode: "3",
    subCriterionCode: "3.9",
    templateFileKey: "templates/3.9.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "2% of total student strength" },
      veryGood: { score: 3, description: "1.5% of total student strength" },
      satisfactory: { score: 2, description: "1% of total student strength" },
      needsImprovement: { score: 1, description: "less than 1% of total student strength" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of students",
        "2.Proof of publication – first page of publication (PhD publications not to be counted)",
        "3.Title of the Paper ",
        "4.Author’s Name with affiliation",
        "5.Name of the Journal",
        "6.Category (SCI/ SCOPUS/ EBSCO/ABDC)",
        "7.Year of Publication ",
        "8.Journal Link",
        "9.DOI Link",
        "10.Proof of Patent published/ granted along with Status report"
      ],
      formula: " (Number of Patent Published/Total number of students)*100"
    }
  },
  {
    indicatorCode: "3.9.2",
    title: "Number of student awards and recognitions received",
    criterionCode: "3",
    subCriterionCode: "3.9",
    templateFileKey: "templates/3.9.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=10" },
      veryGood: { score: 3, description: ">=8" },
      satisfactory: { score: 2, description: ">=6" },
      needsImprovement: { score: 1, description: ">=4" },
      notSatisfactory: { score: 0, description: "<4" },
    },
    guidelines: {
      text: [
        " 1.List of students awarded",
        " 2.Event details",
        " 3.Event photographs (geo tagged)",
        " 4.Certificate of award/ recognition"
      ],
    }
  },
  {
    indicatorCode: "3.9.3",
    title: "Percentage of Student Contribution in various university level committees as Student head/ member/ coordinator",
    criterionCode: "3",
    subCriterionCode: "3.9",
    templateFileKey: "templates/3.9.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=20" },
      veryGood: { score: 3, description: ">=15" },
      satisfactory: { score: 2, description: ">=10" },
      needsImprovement: { score: 1, description: ">=5" },
      notSatisfactory: { score: 0, description: "<5" },
    },
    guidelines: {
      text: [
        " 1.List of Students along with the committee details",
        " 2.Office order or verified list of students from respective committee"
      ],
    }
  },

  // --- Sub-Criteria 3.10: ALUMNI CONTRIBUTION [cite: 276]
  {
    indicatorCode: "3.10.1",
    title: "Alumni representatives in various committees",
    criterionCode: "3",
    subCriterionCode: "3.10",
    templateFileKey: "templates/3.10.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: ">=3" },
      satisfactory: { score: 2, description: ">=2" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "No representation" },
    },
    guidelines: {
      text: [
        " 1.Office order of the committee",
        " 2.MOM of the committee meetings along with attendance sheet"
      ],
      formula: " (Number of Patent Published/Total number of students)*100"
    }
  },
  {
    indicatorCode: "3.10.2",
    title: "Availability of updated Alumni database",
    criterionCode: "3",
    subCriterionCode: "3.10",
    templateFileKey: "templates/3.10.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: ">=60%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        " 1.Database of alumni till the date of assessment as per Alumni office template"
      ],
    }
  },
  {
    indicatorCode: "3.10.3",
    title: "Number of lectures/seminars/events by alumni",
    criterionCode: "3",
    subCriterionCode: "3.10",
    templateFileKey: "templates/3.10.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=7" },
      veryGood: { score: 3, description: ">=5" },
      satisfactory: { score: 2, description: ">=3" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "No events" },
    },
    guidelines: {
      text: [
        " 1.List of lectures/ seminars/ events by alumni",
        " 2.Notice/ office order of such events",
        " 3.Flyer of the event",
        " 4.Event report",
        " 5.Attendance of students",
        " 6.Geotagged photographs",
        " 7.Certificates"
      ],
    }
  },
  {
    indicatorCode: "3.10.4",
    title: "Alumni mentors",
    criterionCode: "3",
    subCriterionCode: "3.10",
    templateFileKey: "templates/3.10.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Office order of alumni being engaged as mentors by the school",
        " 2.List of alumni along with mentees",
        " 3.Minutes of Mentor-Mentee meeting along with attendance sheet and photographs / Mentoring Sessions Report Submitted by Mentor"
      ],
    }
  },
  {
    indicatorCode: "3.10.5",
    title: "Alumni financial support",
    criterionCode: "3",
    subCriterionCode: "3.10",
    templateFileKey: "templates/3.10.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=5 lacs" },
      veryGood: { score: 3, description: ">=4 lacs" },
      satisfactory: { score: 2, description: ">=3 lacs" },
      needsImprovement: { score: 1, description: "<3 lacs" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Financial Contribution of alumni for any event/ seminar/ conference",
        " 2.Transaction details/Acknowledgement slip"
      ],
    }
  },
  
  // =======================================================================
  // CRITERIA 4: FACULTY DEVELOPMENT & DIVERSITY [cite: 303]
  // =======================================================================

  // --- Sub-Criteria 4.1: FACULTY STRENGTH & QUALITY [cite: 304]
  {
    indicatorCode: "4.1.1",
    title: "Percentage of Faculty against sanctioned posts (including Professor of Practice/ Visiting/Adjunct Faculty)",
    criterionCode: "4",
    subCriterionCode: "4.1",
    templateFileKey: "templates/4.1.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100% filled" },
      veryGood: { score: 3, description: "90-95% filled" },
      satisfactory: { score: 2, description: "80-90% filled" },
      needsImprovement: { score: 1, description: "70-80% filled" },
      notSatisfactory: { score: 0, description: "<70% filled" },
    },
    guidelines: {
      text: [
        "List of full time faculty with their current designation"
      ],
      formula: " (Total Number of faculty members in AY/ sanctioned post)*100"
    }
  },
  {
    indicatorCode: "4.1.2",
    title: "Percentage of Faculty with PhD",
    criterionCode: "4",
    subCriterionCode: "4.1",
    templateFileKey: "templates/4.1.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=95%" },
      veryGood: { score: 3, description: "85-94%" },
      satisfactory: { score: 2, description: "75-84%" },
      needsImprovement: { score: 1, description: "65-74%" },
      notSatisfactory: { score: 0, description: "<60%" },
    },
    guidelines: {
      text: [
        "Proof of qualification"
      ],
      formula: " (Number of faculty with Ph.D/ Total Number of faculty members)*100"
    }
  },
  {
    indicatorCode: "4.1.3",
    title: "Percentage of Faculty with PostDoc",
    criterionCode: "4",
    subCriterionCode: "4.1",
    templateFileKey: "templates/4.1.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=10%" },
      veryGood: { score: 3, description: ">=8%" },
      satisfactory: { score: 2, description: ">=7%" },
      needsImprovement: { score: 1, description: ">=5%" },
      notSatisfactory: { score: 0, description: "<5%" },
    },
    guidelines: {
      text: [
        " Details of PostDoc fellowship of faculty members Certificate of PostDoc"
      ],
      formula: " (Number of faculty with PostDoc/ Total Number of faculty members)*100"
    }
  },
  {
    indicatorCode: "4.1.4",
    title: "Gender Ratio (Male: Female:Other)",
    criterionCode: "4",
    subCriterionCode: "4.1",
    templateFileKey: "templates/4.1.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Strong (40:60)" },
      veryGood: { score: 3, description: "Balanced (50:50)" },
      satisfactory: { score: 2, description: "Moderately balanced (60:40)" },
      needsImprovement: { score: 1, description: "Imbalanced (70:30)" },
      notSatisfactory: { score: 0, description: "Highly imbalanced (>80:20)" },
    },
    guidelines: {
      text: [
        "Faculty list"
      ],
    }
  },
  {
    indicatorCode: "4.1.5",
    title: "Experience of Faculty members (Academic and Industry)",
    criterionCode: "4",
    subCriterionCode: "4.1",
    templateFileKey: "templates/4.1.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "33.33% (<8yrs), 33.33% (8-15yrs), 33.33% (>15yrs)" },
    },
    guidelines: {
      text: [
        " 1.List of faculty alongwith their experience details",
        " 2.Experience Letter"
      ],
      formula: ["Number of Faculty with <8 yrs/Total no. offaculties",
        "Number of Faculty with 8-15 yrs//Total no. of faculties",
        " Number of Faculty with>15 yrs//Total no. of faculties"
      ],
      remarks: "Total experience = Academic experience + Industry experience"
    }
  },

  // --- Sub-Criteria 4.2: FACULTY CONTRIBUTION [cite: 310]
  {
    indicatorCode: "4.2.1",
    title: "Number of Trainings, Workshops/ Conferences/ Seminar/ FDP Organized for Faculty Members",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4 Trainings/Seminar/Workshops, Conference organized, FDPs organized Offline, 2 FDPs online" },
      veryGood: { score: 3, description: "3 Trainings/Seminar/Workshops" },
      satisfactory: { score: 2, description: "2 Trainings/Seminar/Workshops, 1 FDP online" },
      needsImprovement: { score: 1, description: "1 Trainings/Seminar/Workshops" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Approval letter",
        " 2.Invitation mail",
        " 3.Notice",
        " 4.Flyer of workshop/ training with SDG mapping",
        " 5.Detail of the resource person",
        " 6.Attendance of the participants",
        " 7.Events reports along with geotag photographs and captions",
        " 8.Feedback",
        " 9.Purpose of organizing",
        " 10.Certification (participation and Organizing)"
      ],
      remarks: [
        "FDP of duration less than 5 days can be included",
        "Minimum duration of FDP should be 1 week",
        "Minimum duration of FDP should be 1 week"
      ],
    }
  },
  {
    indicatorCode: "4.2.2",
    title: "Percentage of Faculty members attending Orientation program/ Refresher Course/ Short Term Course/ Faculty Development program/Workshops",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=60%" },
      needsImprovement: { score: 1, description: ">=40%" },
      notSatisfactory: { score: 0, description: "<40%" },
    },
    guidelines: {
      text: [
        " 1. List of faculty members attending Orientation program/ Refresher Course/Short Term Course /Faculty Development programs along with details",
        " 2. Certificate of participation"
      ],
      formula: "(Number of Faculty Members attending event/ Total number of faculties)* 100",
      remarks: " The faculty will be counted once, even if more events are attended by single faculty. Minimum duration of FDP should be 1 week."
    }
  },
  {
    indicatorCode: "4.2.3",
    title: "Percentage of Faculty members invited as Resource Person at Guest Lectures/Seminars/Trainings/ Workshops/Conferences/FDP",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=20%" },
      veryGood: { score: 3, description: ">=15%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: ">=5%" },
      notSatisfactory: { score: 0, description: "< 5%" },
    },
    guidelines: {
      text: [
        " 1.Event brochure/ invitation letter.",
        " 2.Certificate of recognition/participation",
        " 3.Event photographs (geo tagged)/ screenshots (if applicable)"
      ],
      formula: " (Number of faculty members invited as resource person/ Total number of faculties)* 100",
      remarks: " The faculty will be counted once, even if one faculty member is invited to more events"
    }
  },
  {
    indicatorCode: "4.2.4",
    title: "Percentage of Faculty receiving Awards/ Certificates/ Recognition",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=10%" },
      veryGood: { score: 3, description: ">=7%" },
      satisfactory: { score: 2, description: ">=4%" },
      needsImprovement: { score: 1, description: "< 4%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.Certificate of awards/recognition.",
        "2.Photographs or event reports (if available)",
        "3.Proof of type of incentive given by HEI (commendation letter, certificate or published in newsletter/website)"
      ],
      remarks: [
        "[Note: 1. Only external agency awards is to be considered here i.e. awards, recognition, fellowships at the State, National, International level from Government/Govt. recognised bodies in last AY",
        "2. The Faculty will be counted once, even if more than one award is given to a single faculty.]",
        " Type of awards: Best faculty award, Best paper award, Reviewer in Journal/Newspaper, Editorial Board Member, Chair session etc.",
        "Newspaper/Magazine article publication may also be considered here as recognition"
      ]
    }
  },
  {
    indicatorCode: "4.2.5",
    title: "Percentage of Faculty representation in university committees",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=30%" },
      veryGood: { score: 3, description: ">=20%" },
      satisfactory: { score: 2, description: ">=10%" },
      needsImprovement: { score: 1, description: "< 10%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of faculty members along with committee details",
        " 2.Office order of the committee"
      ],
      formula: " (Number of Faculty involved in university committee/ Total number of Faculty members in school)*100"
    }
  },
  {
    indicatorCode: "4.2.6",
    title: "Percentage of Faculty members having active memberships in Professional Societies/Bodies",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      veryGood: { score: 3, description: ">=90%" },
      satisfactory: { score: 2, description: ">=80%" },
      needsImprovement: { score: 1, description: ">=70%" },
      notSatisfactory: { score: 0, description: "<70%" },
    },
    guidelines: {
      text: [
        " 1. List of faculty members along with membership details",
        " 2.Membership certificate or confirmation letter."
      ],
      formula: " (Number of Faculty having active membership/ Total number of Faculty members in school) *100"
    }
  },
  {
    indicatorCode: "4.2.7",
    title: "e-content developed for a) e-PG Pathshala b) MOOCs c) NPTEL/NMEICT/any other Government Initiatives d) For CEC e) Swayam",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.7_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Developed on any four or more platform" },
      veryGood: { score: 3, description: "Developed on any three platform" },
      satisfactory: { score: 2, description: "Developed on any two platform" },
      needsImprovement: { score: 1, description: "Developed on one platform" },
      notSatisfactory: { score: 0, description: "No content developed" },
    },
    guidelines: {
      text: [
        " 1.Name of the course developed",
        " 2.Hosting platform",
        " 3.Link of the course module platform/ screen shots"
      ],
    }
  },
  {
    indicatorCode: "4.2.8",
    title: "Percentage of Faculty availing grant for attending Conferences, Workshops, professional bodies membership",
    criterionCode: "4",
    subCriterionCode: "4.2",
    templateFileKey: "templates/4.2.8_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=90%" },
      veryGood: { score: 3, description: ">=80%" },
      satisfactory: { score: 2, description: ">=70%" },
      needsImprovement: { score: 1, description: "< 70%" },
      notSatisfactory: { score: 0, description: "No reimbursement" },
    },
    guidelines: {
      text: [
        " 1.Copy of Sanction letter",
        " 2.Proof of attending the event",
        " 3.Amount reimbursed"
      ],
      formula: " (Number of Faculty availing grants/ Total number of Faculty members in school) *100",
      remarks: " The Faculty will be counted once, even if reimbursement availed for more than one in last FY"
    }
  },

  // =======================================================================
  // CRITERIA 5: INSTITUTIONAL GOVERNANCE & STRATEGIC VISION [cite: 340]
  // =======================================================================

  {
    indicatorCode: "5.1", // NOTE: PDF is inconsistent here, numbering as 5.1, 5.2 etc. Mapping to 5.1.X for consistency.
    title: "BUDGET UTILIZATION AND PLANNING OF THE SCHOOL",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">80% budget utilized" },
      veryGood: { score: 3, description: ">=70%" },
      satisfactory: { score: 2, description: ">=60%" },
      needsImprovement: { score: 1, description: ">=50%" },
      notSatisfactory: { score: 0, description: "<50%" },
    },
    guidelines: {
      text: [
        "1.Approved budget document",
        "2.Budget allocation details",
        "3.Expense reports",
        "4.Utilization certificates"
      ],
      formula: " (Expenditure/ Approved Budget)*100"
    }
  },
  {
    indicatorCode: "5.2",
    title: "INFRASTRUCTURE MAINTENANCE AND AMBIENCE",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "All laboratories/MOOT court, classrooms, faculty rooms, and notice boards are well-maintained with complete documentation..." },
      veryGood: { score: 3, description: "Facilities are well-maintained with partial documentation..." },
      satisfactory: { score: 2, description: "Facilities are partially maintained, with partial documentation..." },
      needsImprovement: { score: 1, description: "Facilities are functioning but poorly maintained, with no proper documentation..." },
      notSatisfactory: { score: 0, description: "Facilities are not maintained..." },
    },
    guidelines: {
      text: [
        " 1.Lab/MOOT Court Manuals & SOPs",
        " 2.Maintenance & Servicing Records",
        " 3.Audit & Inspection Reports",
        " 4.Updated Notice Boards",
        " 5.Maintained ambience hygiene of the school ",
        " 6.Fire Safety and & Emergency Equipment Records"
      ],
    }
  },
  {
    indicatorCode: "5.3",
    title: "INFRASTRUCTURE FEEDBACK & ITS IMPLEMENTATION",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Feedback taken and action taken recommended through Academic Council/ Board of Studies/ IQAC" },
      veryGood: { score: 3, description: "Feedback taken with action taken" },
      satisfactory: { score: 2, description: "Feedback taken and partially action taken" },
      needsImprovement: { score: 1, description: "Feedback done but not analyzed" },
      notSatisfactory: { score: 0, description: "Feedback not done" },
    },
    guidelines: {
      text: [
        " 1.Analysis report of feedback",
        " 2.Action taken report",
        " 3.Minutes of Meeting of AC/BOS/IQAC highlighting recommendation"
      ],
    }
  },
  {
    indicatorCode: "5.4",
    title: "NEW LABORATORY SET UP & PURCHASE OF NEW EQUIPMENTS",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "15-20L" },
      veryGood: { score: 3, description: "10-15L" },
      satisfactory: { score: 2, description: "5-10L" },
      needsImprovement: { score: 1, description: "1-5L" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Purchase orders and invoices",
        " 2.Equipment installation and commissioning reports",
        " 3.Budget approval documents"
      ],
    }
  },
  {
    indicatorCode: "5.5",
    title: "DEPARTMENTAL LIBRARY",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Available with issue register for faculty and students both." },
      veryGood: { score: 3, description: "Available with issue register but access limited only for faculty." },
      satisfactory: { score: 2, description: "Available but issue register is not available." },
      needsImprovement: { score: 1, description: "Available but students and faculty are not aware about it, no issue register." },
      notSatisfactory: { score: 0, description: "Not available" },
    },
    guidelines: {
      text: [
        " 1.List of books available in the departmental library",
        " 2.Issue register"
      ],
    }
  },
  {
    indicatorCode: "5.6",
    title: "NO. OF BOOKS PROCURED IN THE LIBRARY",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=20" },
      veryGood: { score: 3, description: ">=15" },
      satisfactory: { score: 2, description: ">=10" },
      needsImprovement: { score: 1, description: "1-10" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Approval document for  books procurement during assessment year",
        " 2.Verified list of books procured from library"
      ],
      remarks: "Unique book titles are required"
    }
  },
  {
    indicatorCode: "5.7",
    title: "NO. OF CLASSROOMS WITH AV FACILITIES",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.7_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "40%" },
      veryGood: { score: 3, description: "30%" },
      satisfactory: { score: 2, description: "20%" },
      needsImprovement: { score: 1, description: "10%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of classrooms with AV facilities",
        " 2.GEO tagged photos"
      ],
      formula: " (Number of Classrooms with AV facilities/Total no. ofclassrooms)* 100",
      remarks: "2 photographs per room to be taken 1. With Room No. 2. Facility available"
    }
  },
  {
    indicatorCode: "5.8",
    title: "SCHOOL NEWSLETTER",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.8_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Content is rich and relevant, layout is clear and engaging, language is error-free, design is creative and appealing..." },
      veryGood: { score: 3, description: "Content is appropriate and engaging, layout is neat, minor language errors present, design is simple..." },
      satisfactory: { score: 2, description: "Content is basic with limited relevance, layout has inconsistencies, noticeable language errors..." },
      needsImprovement: { score: 1, description: "Content lacks clarity or relevance, layout is poor, frequent language errors..." },
      notSatisfactory: { score: 0, description: "No meaningful content, no layout structure..." },
    },
    guidelines: {
      text: [
        " 1.Copies of published newsletters",
        " 2.Weblink of the Newsletters",
        " 3. Stakeholder e-mail records"
      ],
    }
  },
  {
    indicatorCode: "5.9",
    title: "ACCREDITATION/ RANKING/ RATING",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.9_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        "Accreditation/Ranking/Rating certificate for School, Program, Lab, Department"
      ],
    }
  },
  {
    indicatorCode: "5.10",
    title: "WEBSITE OUTLOOK",
    criterionCode: "5",
    subCriterionCode: "5.1",
    templateFileKey: "templates/5.10_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Fully updated" },
      satisfactory: { score: 2, description: "Partially updated" },
      notSatisfactory: { score: 0, description: "Not Updated" },
    },
    guidelines: {
      text: [
        "Website status to be verified by MRU Website Coordinator"
      ],
    }
  },

  // =======================================================================
  // CRITERIA 6: GLOBAL ENGAGEMENT & COLLABORATIONS [cite: 372]
  // =======================================================================

  // --- Sub-Criteria 6.1: MOU'S [cite: 373]
  {
    indicatorCode: "6.1.1",
    title: "MOU's (Memorandum of Understanding): Number of strategic international MoUs/ Partners per program",
    criterionCode: "6",
    subCriterionCode: "6.1",
    templateFileKey: "templates/6.1.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.List of Active MOU",
        "2.Details of the partners/organisation with which MOU has been signed",
        "3.Signed MOU document highlighting the objective of the MOU",
        "4.List of collaborative activities along with report, photographs, attendance and flyer",
        "5.Annual MOU status (in case of previous year MOU)"
      ],
    }
  },

  // --- Sub-Criteria 6.2: EXCHANGE PROGRAMS [cite: 375]
  {
    indicatorCode: "6.2.1",
    title: "Student exchange program - Minimum 3 months",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        "1.List of students applying for exchange programs",
        "2.University/Research lab/industry details.",
        "3.Acceptance letter/mail by the International organization.",
        "4.Report of  the Exchange Program along with Brochure, Certificate, Feedback report"
      ],
    }
  },
  {
    indicatorCode: "6.2.2",
    title: "Short term International Visits - Minimum two weeks",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        " 1.List of students going for international visits",
        " 2.University/Research lab/industry details",
        " 3.Acceptance letter/mail by the International organization",
        " 4.Report of  the International visit along with Brochure, Certificate, Feedback report"
      ],
    }
  },
  {
    indicatorCode: "6.2.3",
    title: "Faculty exchange program",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of faculty members applying for exchange programs",
        " 2.University details",
        " 3.Acceptance letter by international university",
        " 4.Report of  the Exchange Program along with Feedback report "
      ],
    }
  },
  {
    indicatorCode: "6.2.4",
    title: "International Students",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.4_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes(>=1%)" },
      satisfactory: { score: 2, description: "< 1%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.List of the students along with their permanent address record/Citizenship Record",
        "2.Passport and visa copy or other relevant documents",
        "3.MRU I-Card",
        "4.MRU admission letter"
      ],
      formula: " (Number of international students/Total number of students)*100"
    }
  },
  {
    indicatorCode: "6.2.5",
    title: "International Faculty",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.5_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "4" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.List of the faculty members",
        " 2.Passport and visa copy/citizenship card",
        " 3.MRU I-Card",
        " 4.MRU appointment letter",
        " 5.I-Card of the international university",
        " 6.CV of the faculty"
      ],
    }
  },
  {
    indicatorCode: "6.2.6",
    title: "Percentage of international alumni",
    criterionCode: "6",
    subCriterionCode: "6.2",
    templateFileKey: "templates/6.2.6_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=25%" },
      veryGood: { score: 3, description: ">=20%" },
      satisfactory: { score: 2, description: ">=15%" },
      needsImprovement: { score: 1, description: "< 15%" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        "1.Number of existing alumni of the Department verified from Alumni Office",
        "2.List of International Alumni",
        "3.Professional details of the alumni"
      ],
      formula: " (Number of international alumni/total number of alumni)*100"
    }
  },

  // --- Sub-Criteria 6.3: INTERNATIONAL COLLABORATIONS [cite: 382]
  {
    indicatorCode: "6.3.1",
    title: "Conference in collaboration with international universities",
    criterionCode: "6",
    subCriterionCode: "6.3",
    templateFileKey: "templates/6.3.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      notSatisfactory: { score: 0, description: "No" },
    },
    guidelines: {
      text: [
        " 1.Conference details along with brochure",
        " 2.Details of the international convenor",
        " 3.Details of the resource persons",
        " 4.List of the paper presented (National and international separately)",
        " 5.Participants details",
        " 6.Report of the conference along with flyers and geotagged photographs",
        " 7.Screenshot of the online meeting/ paper presentations"
      ],
    }
  },
  {
    indicatorCode: "6.3.2",
    title: "Research activities in collaboration with international universities",
    criterionCode: "6",
    subCriterionCode: "6.3",
    templateFileKey: "templates/6.3.2_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=16" },
      veryGood: { score: 3, description: ">=11" },
      satisfactory: { score: 2, description: ">=6" },
      needsImprovement: { score: 1, description: ">=1" },
      notSatisfactory: { score: 0, description: "No activity" },
    },
    guidelines: {
      text: [
        " 1.Details of the international collaborator",
        " 2.Details of the research Activity conducted",
        " 3.Proof of the Research Activity"
      ],
    }
  },
  {
    indicatorCode: "6.3.3",
    title: "Programs run in collaboration with international universities",
    criterionCode: "6",
    subCriterionCode: "6.3",
    templateFileKey: "templates/6.3.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      veryGood: { score: 3, description: ">=75%" },
      satisfactory: { score: 2, description: ">=50%" },
      needsImprovement: { score: 1, description: ">=25%" },
      notSatisfactory: { score: 0, description: "<25%" },
    },
    guidelines: {
      text: [
        " 1.Approval letter of both universities",
        " 2.Minutes of Meeting for Approval of the program in Academic council and BOS",
        " 3.Curriculum details"
      ],
    }
  },

  // --- Sub-Criteria 6.4: ENGAGEMENT IN GLOBAL ACADEMIC PLATFORMS [cite: 386]
  {
    indicatorCode: "6.4.1",
    title: "Engagement in global academic platforms as a panellist/speaker/ expert/ presenter/ visiting faculty/ guest lecture, etc.",
    criterionCode: "6",
    subCriterionCode: "6.4",
    templateFileKey: "templates/6.4.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=4 Countries" },
      veryGood: { score: 3, description: "3" },
      satisfactory: { score: 2, description: "2" },
      needsImprovement: { score: 1, description: "1" },
      notSatisfactory: { score: 0, description: "No representation" },
    },
    guidelines: {
      text: [
        "1.Invitation from letter international platform.",
        "2.Approval document from Manav Rachna University",
        "3.Link of the event",
        "4.Relevant photographs",
        "5.Certificate of the faculty member"
      ],
    }
  },

  // --- Sub-Criteria 6.5: SEMINARS/LECTURES... [cite: 388]
  {
    indicatorCode: "6.5.1",
    title: "Number of seminars/lectures or global electives/modules initiated by the school featuring international speakers",
    criterionCode: "6",
    subCriterionCode: "6.5",
    templateFileKey: "templates/6.5.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: ">=5" },
      veryGood: { score: 3, description: "4" },
      satisfactory: { score: 2, description: "3" },
      needsImprovement: { score: 1, description: "<3" },
      notSatisfactory: { score: 0, description: "0" },
    },
    guidelines: {
      text: [
        " 1.Invitation letter/mail",
        " 2.Event/ Module details along with flyer/syllabus",
        " 3.Attendance record of students and faculty",
        " 4.Event report along with photographs/ Session photographs",
        " 5.Feedback from participants"
      ],
    }
  },

  // =======================================================================
  // CRITERIA 7: STAKEHOLDER INSIGHTS & CONTINUOUS IMPROVEMENT [cite: 402]
  // =======================================================================

  // --- Sub-Criteria 7.1: NET PROMOTER SCORE [cite: 403]
  {
    indicatorCode: "7.1.1",
    title: "Percentage of Students participated in NPS Survey",
    criterionCode: "7",
    subCriterionCode: "7.1",
    templateFileKey: "templates/7.1.1_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "100%" },
      veryGood: { score: 3, description: ">=90%" },
      satisfactory: { score: 2, description: ">=85%" },
      needsImprovement: { score: 1, description: ">=80%" },
      notSatisfactory: { score: 0, description: "<80%" }
    },
    guidelines: {
      text: [
        "Verified Response Report from the Office of Dean Student Welfare"
      ],
      formula: "Number of students submitted the response/Total number of students"
    }
  },
  {
    indicatorCode: "7.1.2",
    title: "Net Promoter Score",
    criterionCode: "7",
    subCriterionCode: "7.1",
    templateFileKey: "templates/NO_Template.xlsx",
    requiresEvidenceLink: true,
    templateFileKey: "templates/7.1.2_Template.xlsx",
    rubric: {
      excellent: { score: 4, description: ">12" },
      veryGood: { score: 3, description: ">8" },
      satisfactory: { score: 2, description: ">4" },
      needsImprovement: { score: 1, description: "0-4" },
      notSatisfactory: { score: 0, description: "<0" }
    },
    guidelines: {
      text: [
        " Verified Report from the  Office of Dean Student Welfare"
      ],
    }
  },
  {
    indicatorCode: "7.1.3",
    title: "Analysis & Action Taken Report",
    criterionCode: "7",
    subCriterionCode: "7.1",
    templateFileKey: "templates/7.1.3_Template.xlsx",
     requiresEvidenceLink: true,
    rubric: {
      excellent: { score: 4, description: "Yes" },
      veryGood: { score: 3, description: "" },
      satisfactory: { score: 2, description: "" },
      needsImprovement: { score: 1, description: "" },
      notSatisfactory: { score: 0, description: "No" }
    },
    guidelines: {
      text: [
        "Action Taken Report"
      ],
    }
  }
];

module.exports = indicators;
