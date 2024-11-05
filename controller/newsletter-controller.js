const { Newsletter } = require("../config/dbconfig");
const validator = require("validator");

const NewsletterController = {
  // Méthode de vérification des données de la newsletter
  checkData(data) {
    const { email, name } = data;

    if (!validator.isEmail(email)) {
      console.log("Validation échouée : email non valide");
      return { valid: false, message: "L'email n'est pas valide!" };
    }

    if (!validator.isLength(name, { min: 2, max: 50 }) || !validator.isAlpha(name)) {
      console.log("Validation échouée : name invalide");
      return {
        valid: false,
        message: "Le name doit contenir entre 2 et 50 caractères et ne doit contenir que des lettres.",
      };
    }
    return { valid: true };
  },

  // Méthode pour ajouter une newsletter
  async addNewsletter(req, res) {
    const { email, name } = req.body;
    const { valid, message } = NewsletterController.checkData({ email, name });
    if (!valid) return res.status(400).json({ message });

    const existNewsletter = await Newsletter.findOne({ where: { email } });
    if (existNewsletter) {
      return res.status(409).json({ valid: false, message: "Vous êtes déjà inscrit" });
    }

    await Newsletter.create(req.body);
    res.status(201).json({ message: "Inscription validée" });
  },

  // Méthode pour supprimer une newsletter
  async deleteNewsletter(req, res) {
    const { email } = req.body;
    const existNewsletter = await Newsletter.findOne({ where: { email } });
    if (!existNewsletter) {
      return res.status(404).json({
        valid: false,
        message: "Cette adresse email n'est pas enregistrée",
      });
    }

    await Newsletter.destroy({ where: { email } });
    res.status(200).json({ message: "Suppression réussie" });
  },

  // Méthode pour mettre à jour l'activation de la newsletter
  async updateActiveNewsletter(req, res) {
    const { email } = req.body;
    const existNewsletter = await Newsletter.findOne({ where: { email } });
    if (!existNewsletter) {
      return res.status(404).json({
        valid: false,
        message: "Cette adresse email n'est pas enregistrée",
      });
    }

    await existNewsletter.update({ active: !existNewsletter.active });
    res.status(200).json({ message: "Mise à jour réussie" });
  },
  // Méthode pour récupérer la liste des newsletters
  async getNewsletters(req, res) {
    const newsletters = await Newsletter.findAll();
    res.json(newsletters);
  },
};

module.exports = NewsletterController;
