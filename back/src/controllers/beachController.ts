import { Request, Response, NextFunction } from "express";
import {
  getBeachByNameService,
  getBeachByIdService,
  getBeachByRegionAndYearSpecificServiceAvg,
  getBeachByRegionAndYearSpecificService,
  getBeachesService,
  getBeachByRegionAndYearService,
} from "../services/beachService";
import { StatusCodes } from "http-status-codes";
import { IRankedBeach } from 'beach';
import { Types } from "mongoose";

const getBeachByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.params.name;
    console.log(name)

    const result = await getBeachByNameService(name);
    if (result) {
      res.status(StatusCodes.OK).json(result);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ message: "not found error" });
    }
  } catch (e) {
    next(e);
  }
};

const getBeachById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = new Types.ObjectId(req.params._id); // _id 파라미터를 ObjectId로 변환

    const result = await getBeachByIdService(_id); // _id 값을 직접 전달
    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    next(e);
  }
};

const getBeachByRegionAndYear = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { address, year } = req.params;
    const result = await getBeachByRegionAndYearService(address, year); // 주소와 연도 값을 직접 전달
    
    // globalScore를 기준으로 오름차순 정렬
    const sortedData = result.sort((a: any, b: any) => a._doc.globalScore - b._doc.globalScore);

    // 각 객체의 _doc 안에 rank 추가
    const rankedData = sortedData.map((item: any, index) => {
      item._doc.rank = index + 1;
      return item;
    });

    res.status(StatusCodes.OK).json(rankedData);
  } catch (e) {
    next(e);
  }
};

// 지역별 및 연도별 가져오기 및 추가조건
const getBeachByRegionAndYearSpecificAvg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = req.params.year; // 연도 파라미터를 받아옴

    const result = await getBeachByRegionAndYearSpecificServiceAvg(year); // 주소와 연도 값을 직접 전달

    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    next(e);
  }
};

// 지역별 및 연도별 가져오기 및 추가조건
const getBeachByRegionAndYearSpecific = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = req.params.year; // 연도 파라미터를 받아옴

    const result = await getBeachByRegionAndYearSpecificService(year); // 주소와 연도 값을 직접 전달

    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    next(e);
  }
};

const getBeaches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getBeachesService();
    res.status(StatusCodes.OK).json(result);
  } catch (e) {
    next(e);
  }
};

export {
  getBeachByName,
  getBeachById,
  getBeachByRegionAndYear,
  getBeachByRegionAndYearSpecificAvg,
  getBeachByRegionAndYearSpecific,
  getBeaches,
};
