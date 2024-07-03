import Student from "../models/Student.js";
import College from "../models/College.js";
import Party from "../models/Party.js";
import Course from "../models/Course.js";
import General from "../models/General.js";
import CsvParser from "json2csv";

export const CreateStudentController = async (req, res) => {
  const students = req.body;

  try {
    for (let i = 0; i < students.length; i++) {
      const {
        name,
        phone,
        responsible_name,
        born_date,
        registration,
        id_college,
        id_party,
        id_courses,
      } = students[i];

      if (id_college) {
        const if_exists_college = await College.findById(id_college);
        if (!if_exists_college) {
          return res.status(200).send({
            message: "A escola não existe no banco de dados.",
          });
        }
      }

      if (id_party) {
        const if_exists_party = await Party.findById(id_party);
        if (!if_exists_party) {
          return res
            .status(200)
            .send({ message: "Adicione todas as turmas ao banco de dados." });
        }
      }

      if (id_courses) {
        for (let i = 0; i < id_courses.length; i++) {
          const if_exists_course = await Course.findById(id_courses[i]);
          if (!if_exists_course) {
            return res.status(200).send({
              message: `Adicione todos os cursos ao banco de dados.`,
            });
          }
        }
      }

      const if_exists_student = await Student.findOne({
        name,
        phone,
        responsible_name,
      });

      if (if_exists_student) {
        return res.status(200).json({
          message: `O ${i + 1}º estudante da lista já está cadastrado`,
        });
      }
    }

    for (let i = 0; i < students.length; i++) {
      const {
        name,
        phone,
        responsible_name,
        born_date,
        registration,
        id_college,
        id_party,
        id_courses,
      } = students[i];

      const student = new Student({
        name: name.toLowerCase(),
        phone: phone.toLowerCase(),
        responsible_name: responsible_name.toLowerCase(),
        born_date,
        registration,
        id_college,
        id_party,
        id_courses,
      });

      await student.save();

      // const id_student = student._id;

      // const general = new General({
      //   id_student,
      //   id_course,
      //   id_party,
      //   id_college,
      //   student_registration: registration,
      // });

      // await general.save();
    }

    return res
      .status(201)
      .send({ message: "Estudantes registrados com sucesso" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const ExportStudentsController = async (req, res) => {
  const {
    name_college,
    city_college,
    uf_college,
    time_party,
    grade_party,
    courses,
    student_registration,
  } = req.body;

  const filterCriteria = {};

  try {
    const ufCollegeUpperCase = uf_college ? uf_college.toUpperCase() : null;

    if (name_college && !city_college && !ufCollegeUpperCase) {
      const college = await College.findOne({ name: name_college });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (city_college && !name_college && !ufCollegeUpperCase) {
      const college = await College.findOne({ city: city_college });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (ufCollegeUpperCase && !name_college && !city_college) {
      const college = await College.findOne({ uf: ufCollegeUpperCase });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && city_college && !ufCollegeUpperCase) {
      const college = await College.findOne({
        name: name_college,
        city: city_college,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && ufCollegeUpperCase && !city_college) {
      const college = await College.findOne({
        name: name_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (city_college && ufCollegeUpperCase && !name_college) {
      const college = await College.findOne({
        city: city_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && city_college && ufCollegeUpperCase) {
      const college = await College.findOne({
        name: name_college,
        city: city_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    }

    if (time_party && !grade_party) {
      const party = await Party.findOne({ time: time_party });
      if (party) filterCriteria.id_party = party._id.toString();
    } else if (grade_party && !time_party) {
      const party = await Party.findOne({ grade: grade_party });
      if (party) filterCriteria.id_party = party._id.toString();
    } else if (time_party && grade_party) {
      const party = await Party.findOne({
        time: time_party,
        grade: grade_party,
      });
      if (party) filterCriteria.id_party = party._id.toString();
    }

    if (courses && courses.length > 0) {
      const courseIds = await Promise.all(
        courses.map(async (course) => {
          const foundCourse = await Course.findOne({ name: course });
          return foundCourse ? foundCourse._id.toString() : null;
        })
      );
      filterCriteria.id_courses = { $in: courseIds.filter(Boolean) };
    }

    if (student_registration) {
      filterCriteria.student_registration = student_registration.toLowerCase();
    }

    if (Object.keys(filterCriteria).length === 0) {
      return res.status(200).send({
        message: "Nenhum aluno encontrado com os critérios fornecidos.",
      });
    }

    const studentsData = await Student.find(filterCriteria);

    if (studentsData.length === 0) {
      return res.status(404).send({
        message: "Nenhum aluno encontrado com os critérios fornecidos.",
      });
    }

    const csvHeader =
      "Nome,Telefone,Nome do Responsável,Idade,Data de Registro\n";

    let students = csvHeader;

    studentsData.forEach((student) => {
      const { name, phone, responsible_name, born_date, registration } =
        student;

      const currentDate = new Date();
      const born = new Date(born_date);
      const difference = currentDate - born;
      const age = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));

      const formattedRegistration = new Date(registration).toLocaleDateString(
        "pt-BR"
      );

      students += `${name},${phone},${responsible_name},${age},${formattedRegistration}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attatchment: filename=alunos.csv");

    res.status(200).end(students);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const GetAllStudentsController = async (req, res) => {
  const { page } = req.body;
  const perPage = 10;

  try {
    const students = await Student.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalStudents = await Student.countDocuments();

    const nextPage = page * perPage < totalStudents ? page + 1 : null;

    res.status(200).json({ students, nextPage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetStudentsBySearchController = async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const students = await Student.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { responsible_name: { $regex: searchTerm, $options: "i" } },
      ],
    });

    res.status(200).json({ students });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const GenerateListOfStudentsController = async (req, res) => {
  const {
    name_college,
    city_college,
    uf_college,
    time_party,
    grade_party,
    courses,
    student_registration,
  } = req.body;

  const filterCriteria = {};

  try {
    const ufCollegeUpperCase = uf_college ? uf_college.toUpperCase() : null;

    if (name_college && !city_college && !ufCollegeUpperCase) {
      const college = await College.findOne({ name: name_college });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (city_college && !name_college && !ufCollegeUpperCase) {
      const college = await College.findOne({ city: city_college });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (ufCollegeUpperCase && !name_college && !city_college) {
      const college = await College.findOne({ uf: ufCollegeUpperCase });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && city_college && !ufCollegeUpperCase) {
      const college = await College.findOne({
        name: name_college,
        city: city_college,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && ufCollegeUpperCase && !city_college) {
      const college = await College.findOne({
        name: name_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (city_college && ufCollegeUpperCase && !name_college) {
      const college = await College.findOne({
        city: city_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    } else if (name_college && city_college && ufCollegeUpperCase) {
      const college = await College.findOne({
        name: name_college,
        city: city_college,
        uf: ufCollegeUpperCase,
      });
      if (college) filterCriteria.id_college = college._id.toString();
    }

    if (time_party && !grade_party) {
      const party = await Party.findOne({ time: time_party });
      if (party) filterCriteria.id_party = party._id.toString();
    } else if (grade_party && !time_party) {
      const party = await Party.findOne({ grade: grade_party });
      if (party) filterCriteria.id_party = party._id.toString();
    } else if (time_party && grade_party) {
      const party = await Party.findOne({
        time: time_party,
        grade: grade_party,
      });
      if (party) filterCriteria.id_party = party._id.toString();
    }

    if (courses && courses.length > 0) {
      const courseIds = await Promise.all(
        courses.map(async (course) => {
          const foundCourse = await Course.findOne({ name: course });
          return foundCourse ? foundCourse._id.toString() : null;
        })
      );
      filterCriteria.id_courses = { $in: courseIds.filter(Boolean) };
    }

    if (student_registration) {
      filterCriteria.registration = student_registration.toLowerCase();
    }

    if (Object.keys(filterCriteria).length === 0) {
      return res.status(200).send({
        message: "Nenhum aluno encontrado com os critérios fornecidos.",
      });
    }

    const studentsData = await Student.find(filterCriteria);

    if (studentsData.length === 0) {
      return res.status(200).send({
        message: "Nenhum aluno encontrado com os critérios fornecidos.",
      });
    }

    return res.status(201).send(studentsData);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const UpdateStudentController = async (req, res) => {
  const {
    _id,
    name,
    phone,
    responsible_name,
    born_date,
    name_college,
    city_college,
    time_party,
    grade_party,
    courses,
  } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name.toLowerCase();
    if (phone) updateFields.phone = phone.toLowerCase();
    if (responsible_name)
      updateFields.responsible_name = responsible_name.toLowerCase();
    if (born_date) updateFields.born_date = born_date.toLowerCase();
    if (name_college) updateFields.name_college = name_college.toLowerCase();
    if (city_college) updateFields.city_college = city_college.toLowerCase();
    if (time_party) updateFields.time_party = time_party.toLowerCase();
    if (grade_party) updateFields.grade_party = grade_party.toLowerCase();
    if (courses) updateFields.courses = courses;

    const student = await Student.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true }
    );

    if (!student) {
      res.status(404).send({ message: "Estudante não encontrado." });
    }

    return res
      .status(201)
      .send({ message: "Estudante atualizado com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const DeleteStudentController = async (req, res) => {
  const { id: studentId } = req.params;

  try {
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(204).send({ message: "Estudante não encontrado." });
    }

    res.status(200).send({ message: "Estudante deletado com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
