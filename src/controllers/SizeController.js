import Size from "../models/size.model.js";

export default class SizeController {
  async create(req, res) {
    try {
      const data = req.body;
      const Sizes = await Size.create(data);
      res.json(Sizes);
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
  //   async show(req, res) {
  //     try {
  //       const { SizeId } = req.params;
  //       const Size = await Size.findById(SizeId);
  //       res.json({
  //         data: Size,
  //       });
  //     } catch (error) {
  //       res.json(error);
  //     }
  //   }
  async index(req, res) {
    try {
      const Sizes = await Size.find({});
      res.json({
        data: Sizes,
        status_code: 200,
      });
    } catch (error) {
      res.json({
        error: {
          message: error.message,
        },
      });
    }
  }
}
