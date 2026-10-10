import Schedule from '../models/Schedule.js';
import Aquarium from '../models/Aquarium.js';

export const createSchedule = async (req, res) => {
  try {
    const { aquarium_id, type, time_of_day, frequency, next_scheduled_at } = req.body;
    const userId = req.user.userId;

    // 어항이 사용자에게 속하는지 확인
    const aquarium = await Aquarium.findOne({
      where: { id: aquarium_id, user_id: userId, deleted_at: null },
    });

    if (!aquarium) {
      return res.status(404).json({ error: '어항을 찾을 수 없습니다.' });
    }

    const schedule = await Schedule.create({
      aquarium_id,
      type,
      time_of_day,
      frequency,
      next_scheduled_at,
    });

    res.status(201).json({
      message: '일정이 생성되었습니다.',
      schedule,
    });
  } catch (error) {
    console.error('일정 생성 오류:', error);
    res.status(500).json({ error: '일정 생성 중 오류가 발생했습니다.' });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const { aquarium_id } = req.query;
    const userId = req.user.userId;

    // 어항 소유 확인
    const aquarium = await Aquarium.findOne({
      where: { id: aquarium_id, user_id: userId, deleted_at: null },
    });

    if (!aquarium) {
      return res.status(404).json({ error: '어항을 찾을 수 없습니다.' });
    }

    const schedules = await Schedule.findAll({
      where: { aquarium_id, deleted_at: null },
      order: [['next_scheduled_at', 'ASC']],
    });

    res.status(200).json({
      schedules,
    });
  } catch (error) {
    console.error('일정 조회 오류:', error);
    res.status(500).json({ error: '일정 조회 중 오류가 발생했습니다.' });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { type, time_of_day, frequency, next_scheduled_at } = req.body;

    const schedule = await Schedule.findOne({
      include: [
        {
          model: Aquarium,
          where: { user_id: userId, deleted_at: null },
        },
      ],
      where: { id, deleted_at: null },
    });

    if (!schedule) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }

    await schedule.update({
      type,
      time_of_day,
      frequency,
      next_scheduled_at,
    });

    res.status(200).json({
      message: '일정이 업데이트되었습니다.',
      schedule,
    });
  } catch (error) {
    console.error('일정 업데이트 오류:', error);
    res.status(500).json({ error: '일정 업데이트 중 오류가 발생했습니다.' });
  }
};

export const completeSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const schedule = await Schedule.findOne({
      include: [
        {
          model: Aquarium,
          where: { user_id: userId, deleted_at: null },
        },
      ],
      where: { id, deleted_at: null },
    });

    if (!schedule) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }

    // 완료 시간 업데이트 및 다음 일정 계산
    await schedule.update({
      last_completed_at: new Date(),
    });

    res.status(200).json({
      message: '일정이 완료되었습니다.',
      schedule,
    });
  } catch (error) {
    console.error('일정 완료 오류:', error);
    res.status(500).json({ error: '일정 완료 중 오류가 발생했습니다.' });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const schedule = await Schedule.findOne({
      include: [
        {
          model: Aquarium,
          where: { user_id: userId, deleted_at: null },
        },
      ],
      where: { id, deleted_at: null },
    });

    if (!schedule) {
      return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });
    }

    await schedule.update({ deleted_at: new Date() });

    res.status(200).json({
      message: '일정이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    res.status(500).json({ error: '일정 삭제 중 오류가 발생했습니다.' });
  }
};
