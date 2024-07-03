import Party from "../models/Party.js";

export const CreatePartyController = async (req, res) => {
  const partys = req.body;

  try {
    for (let i = 0; i < partys.length; i++) {
      const { grade, time } = partys[i];

      if (grade && time) {
        const if_party_exists = await Party.findOne({
          grade: grade.toLowerCase(),
          time: time.toLowerCase(),
        });
        if (if_party_exists) {
          return res.status(200).send({
            message: `A ${
              i + 1
            } turma da lista local já existe no banco de dados`,
          });
        }
      }
    }

    for (let i = 0; i < partys.length; i++) {
      const { grade, time } = partys[i];

      const party = new Party({
        grade: grade.toLowerCase(),
        time: time.toLowerCase(),
      });

      await party.save();
    }

    return res.status(201).send({ message: "Turmas adicionadas com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const GetAllPartiesController = async (req, res) => {
  try {
    const parties = await Party.find();

    res.status(200).json({ parties });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const UpdatePartyController = async (req, res) => {
  const { id } = req.params;

  const { grade, time } = req.body;

  try {
    const updateFields = {};
    if (grade) updateFields.grade = grade.toLowerCase();
    if (time) updateFields.time = time.toLowerCase();

    const party = await Party.findByIdAndUpdate(id, updateFields);

    if (!party) {
      return res
        .status(200)
        .send({ message: "Esta turma não existe no banco de dados." });
    }

    return res.status(201).send({ message: "Turma atualizada com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const FindPartyController = async (req, res) => {
  const { grade_party, time_party } = req.body;

  try {
    const party = await Party.find({
      grade: grade_party,
      time: time_party,
    });

    return res.status(201).send({ party });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
