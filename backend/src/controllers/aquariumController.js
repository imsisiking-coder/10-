import Aquarium from '../models/Aquarium.js';
import Fish from '../models/Fish.js';
import FishSpecies from '../models/FishSpecies.js';

export const createAquarium = async (req, res) => {
  try {
    const { name, size, type, description } = req.body;
    const userId = req.user.userId;

    const aquarium = await Aquarium.create({
      user_id: userId,
      name,
      size,
      type: type || 'freshwater',
      description,
    });

    res.status(201).json({
      message: '어항이 생성되었습니다.',
      aquarium,
    });
  } catch (error) {
    console.error('어항 생성 오류:', error);
    res.status(500).json({ error: '어항 생성 중 오류가 발생했습니다.' });
  }
};

export const getAquariums = async (req, res) => {
  try {
    const userId = req.user.userId;

    const aquariums = await Aquarium.findAll({
      where: { user_id: userId, deleted_at: null },
      include: [
        {
          model: Fish,
          include: [FishSpecies],
        },
      ],
    });

    res.status(200).json({
      aquariums,
    });
  } catch (error) {
    console.error('어항 조회 오류:', error);
    res.status(500).json({ error: '어항 조회 중 오류가 발생했습니다.' });
  }
};

export const getAquariumById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const aquarium = await Aquarium.findOne({
      where: { id, user_id: userId, deleted_at: null },
      include: [
        {
          model: Fish,
          include: [FishSpecies],
        },
      ],
    });

    if (!aquarium) {
      return res.status(404).json({ error: '어항을 찾을 수 없습니다.' });
    }

    res.status(200).json({
      aquarium,
    });
  } catch (error) {
    console.error('어항 조회 오류:', error);
    res.status(500).json({ error: '어항 조회 중 오류가 발생했습니다.' });
  }
};

export const updateAquarium = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { name, size, type, description } = req.body;

    const aquarium = await Aquarium.findOne({
      where: { id, user_id: userId, deleted_at: null },
    });

    if (!aquarium) {
      return res.status(404).json({ error: '어항을 찾을 수 없습니다.' });
    }

    await aquarium.update({
      name,
      size,
      type,
      description,
    });

    res.status(200).json({
      message: '어항이 업데이트되었습니다.',
      aquarium,
    });
  } catch (error) {
    console.error('어항 업데이트 오류:', error);
    res.status(500).json({ error: '어항 업데이트 중 오류가 발생했습니다.' });
  }
};

export const deleteAquarium = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const aquarium = await Aquarium.findOne({
      where: { id, user_id: userId, deleted_at: null },
    });

    if (!aquarium) {
      return res.status(404).json({ error: '어항을 찾을 수 없습니다.' });
    }

    // 소프트 삭제
    await aquarium.update({ deleted_at: new Date() });

    res.status(200).json({
      message: '어항이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('어항 삭제 오류:', error);
    res.status(500).json({ error: '어항 삭제 중 오류가 발생했습니다.' });
  }
};
