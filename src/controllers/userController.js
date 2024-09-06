const controller = {};

controller.getUser = (req, res) => {
  res.send({ status: 200, text: "hola" });
};

module.exports = controller;
