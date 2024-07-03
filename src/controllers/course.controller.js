import Course from "../models/Course.js";

export const CreateCourseController = async (req, res) => {
  const courses = req.body;

  try {
    for (let i = 0; i < courses.length; i++) {
      const { name } = courses[i];

      if (name) {
        const if_course_exists = await Course.findOne({
          name: name.toLowerCase(),
        });
        if (if_course_exists) {
          return res
            .status(200)
            .send({ message: `O ${i + 1}º curso da lista local já existe.` });
        }
      }
    }

    for (let i = 0; i < courses.length; i++) {
      const { name } = courses[i];

      const course = new Course({
        name: name.toLowerCase(),
      });

      await course.save();
    }

    return res.status(201).send({ message: "Cursos adicionados com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const GetAllCoursesController = async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const UpdateCourseController = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name.toLowerCase();

    const course = await Course.findByIdAndUpdate(id, updateFields);

    if (!course) {
      return res
        .status(200)
        .send({ message: "Este curso não esxiste no banco de dados." });
    }

    return res.status(201).send({ message: "Curso atualizado com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const FindCourseController = async (req, res) => {
  const { name_course } = req.body;

  try {
    const course = await Course.find({ name: name_course });

    return res.status(201).send({ course });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
