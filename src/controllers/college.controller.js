import College from "../models/College.js";
import { ObjectId } from "mongodb";

export const CreateCollegeController = async (req, res) => {
  const colleges = req.body;

  try {
    for (let i = 0; i < colleges.length; i++) {
      const { name, uf, city } = colleges[i];

      if (name && uf && city) {
        const if_exists_college = await College.findOne({
          name: name.toLowerCase(),
          uf: uf.toUpperCase(),
          city: city.toLowerCase(),
        });
        if (if_exists_college) {
          return res.status(200).send({
            message: `A ${i + 1}º instiuição da lista local já existe.`,
          });
        }
      }
    }

    for (let i = 0; i < colleges.length; i++) {
      const { name, uf, city } = colleges[i];

      const college = new College({
        name: name.toLowerCase(),
        uf: uf.toUpperCase(),
        city: city.toLowerCase(),
      });

      await college.save();
    }

    return res
      .status(201)
      .send({ message: "Instituições criadas com sucesso!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const GetAllCollegesController = async (req, res) => {
  try {
    const colleges = await College.find();

    res.status(200).json({ colleges });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const UpdateCollegeController = async (req, res) => {
  const { id } = req.params;

  const { name, uf, city } = req.body;

  try {
    const updateFields = {};
    if (name) updateFields.name = name.toLowerCase();
    if (uf) updateFields.uf = uf.toUpperCase();
    if (city) updateFields.city = city.toLowerCase();
    if (!name && !uf && !city) {
      return res.status(200).send({ message: "Nenhum dado foi modificado" });
    }

    const college = await College.findByIdAndUpdate(id, updateFields);

    if (!college) {
      return res
        .status(200)
        .send({ message: "Esta escola não existe no banco de dados." });
    }

    return res
      .status(201)
      .send({ message: "Instituição atualizada com sucesso." });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const FindCollegeController = async (req, res) => {
  const { name_college, uf_college, city_college } = req.body;

  try {
    const college = await College.find({
      name: name_college,
      uf: uf_college,
      city: city_college,
    });

    return res.status(201).send({ college });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
