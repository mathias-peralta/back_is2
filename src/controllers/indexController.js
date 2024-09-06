const controller = {};

controller.list = (req, res) => {
  res.send({ status: 200, text: "hola" });
};

module.exports = controller;
