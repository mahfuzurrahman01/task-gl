/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  GridContextProvider,
  GridDropZone,
  GridItem,
  move,
  swap,
} from "react-grid-dnd";
import Image from "next/image";
import Images from "../api/mockItem1.json";
import Images2 from "../api/mockItem2.json";
import Images3 from "../api/mockItem3.json";
import { AiFillCheckSquare } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useWindowWidth } from "@react-hook/window-size";

export type IItem = {
  id: number;
  image: string;
  checked: boolean;
};

const Page = () => {
  const [items, setItems] = useState<any>({ Images, Images2, Images3 });
  const [bprCount, setBprCount] = useState(2);
  const [selectedItemsId, setSelectedItemsId] = useState<number[]>([]);

  const width = useWindowWidth();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // target id will only be set if dragging from one dropzone to another.
  function onChange(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string
  ) {
    try {
      if (targetId) {
        const result = move(
          items[sourceId],
          items[targetId],
          sourceIndex,
          targetIndex
        );
        let newTargetResult: any[] = [];
        let removedItem: IItem = {} as IItem;
        if (targetId === "Images") {
          const previousTargetItem = items[targetId][0];
          const previousTargetResult = result[1];
          if (items[targetId]?.length !== 0) {
            newTargetResult = previousTargetResult.filter(
              (item: any) => previousTargetItem.id !== item.id
            );
            const previousSourceResult = result[0];
            previousSourceResult.unshift(previousTargetItem);
          } else {
            const upcomingItem = items[sourceId][sourceIndex];

            newTargetResult.push(upcomingItem);
          }
        }
        if (targetId === "Images2") {
          const lastLists = result[1];
          if (lastLists.length > 4) {
            removedItem = lastLists.pop() as IItem;
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);
          } else {
            removedItem = lastLists.pop() as IItem;
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);
          }
        }
        if (targetId === "Images3") {
          const lastLists = result[1];

          if (lastLists.length > 6) {
            removedItem = lastLists.pop() as IItem;
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);
          } else {
            removedItem = lastLists.pop() as IItem;
            newTargetResult = lastLists;
            const previousSourceResult = result[0];
            previousSourceResult.unshift(removedItem);
          }
        }

        return setItems({
          ...items,
          [sourceId]: result[0],
          [targetId]:
            targetId === "Images" || targetId === "Images2"
              ? newTargetResult
              : result[1],
        });
      }

      const result = swap(items[sourceId], sourceIndex, targetIndex);
      return setItems({
        ...items,
        [sourceId]: result,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckboxChange = (item: IItem) => {
    if (selectedItemsId.includes(item.id)) {
      const newArray = selectedItemsId.filter((x: any) => x !== item.id);
      setSelectedItemsId(newArray);
      return;
    } else {
      setSelectedItemsId([...selectedItemsId, item.id]);
    }
  };

  const deleteHandle = () => {
    const totalItem =
      items.Images.length + items.Images2.length + items.Images3.length;
    if (totalItem === selectedItemsId.length) {
      Toast.fire({
        icon: "warning",
        title: "Don't be so rude, There will be no item left! 😔😔",
      });
      return;
    }
    for (let index = 0; index < selectedItemsId.length; index++) {
      const selectedId = selectedItemsId[index];

      const filteredImages = items.Images.filter(
        (item: IItem) => selectedId !== item.id
      );
      items["Images"] = filteredImages;

      const filteredImages2 = items.Images2.filter(
        (item: IItem) => selectedId !== item.id
      );

      items["Images2"] = filteredImages2;
      const filteredImages3 = items.Images3.filter(
        (item: IItem) => selectedId !== item.id
      );

      items["Images3"] = filteredImages3;
    }
    if (items.Images.length === 0) {
      if (items.Images2.length > 0) {
        const removedItem = items.Images2.shift();
        items["Images"].push(removedItem);
      } else {
        const removedItem = items.Images3.shift();
        items["Images"].push(removedItem);
      }
    }

    if (items.Images3.length > 0 && items.Images2.length < 4) {
      const secondBoxNeed = 4 - items.Images2.length;
      const removedItem = items.Images3.splice(0, secondBoxNeed);
      const newArr = items.Images2.concat(removedItem);
      items["Images2"] = newArr;
    }
    // showing toast message
    Toast.fire({
      icon: "success",
      title: "Successfully deleted",
    });
    setSelectedItemsId([]);
    return setItems({
      ...items,
    });
  };

  return (
    <div className="">
      {bprCount && (
        <div className="w-full mx-auto ">
          <GridContextProvider onChange={onChange}>
            <div className="w-3/5 relative mx-auto mt-16">
              <div className="w-full flex lg:flex-row flex-col justify-between lg:items-center items-start my-5">
                {selectedItemsId?.length > 0 && (
                  <p className="flex justify-start items-center gap-3 my-2">
                    <AiFillCheckSquare className="w-5 h-5 bg-blue-50 text-blue-500" />{" "}
                    Selected Items: {selectedItemsId?.length}
                  </p>
                )}
                {selectedItemsId?.length > 0 && (
                  <div
                    onClick={deleteHandle}
                    className="flex justify-start items-center gap-1 my-2 bg-red-500 p-1 text-white rounded-md cursor-pointer"
                  >
                    <BsFillTrashFill /> Delete
                  </div>
                )}
              </div>
              <div className="grid lg:grid-cols-2 md:grid-cols-1 w-full gap-5 relative mx-auto">
                {/* ================First droppable Item zone ===========  */}
                {items.Images.length > 0 && (
                  <GridDropZone
                    id="Images"
                    boxesPerRow={1}
                    rowHeight={1}
                    className="md:h-[440px] h-[300px] mr-16 w-full "
                  >
                    {items?.Images?.map((item: IItem, index: number) => (
                      <GridItem key={item.id}>
                        <div
                          className={`m-1 rounded-md shadow-xl shadow-slate-200 cursor-grab overflow-hidden duration-500`}
                        >
                          <Image
                            src={item.image}
                            alt="item-image"
                            width={500}
                            height={500}
                            className="w-full md:h-[410px] h-[300px]"
                          />
                          <div className="w-full md:h-[410px] h-[300px] bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                          <div className="w-full md:h-[410px] h-[300px] bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                            <input
                              type="checkbox"
                              checked={selectedItemsId?.includes(item.id)}
                              onChange={() => handleCheckboxChange(item)}
                              className="w-5 h-5 absolute right-3 top-3"
                            />
                          </div>
                        </div>
                      </GridItem>
                    ))}
                  </GridDropZone>
                )}
                {/* ================second droppable Item zone ===========  */}
                {items.Images2.length > 0 && (
                  <GridDropZone
                    id="Images2"
                    boxesPerRow={2}
                    rowHeight={width > 600 ? 220 : 120}
                    className="lg:h-[410px] md:h-[460px] h-[240px] w-full"
                  >
                    {items.Images2.map((item: IItem, index: number) => (
                      <GridItem key={item.id}>
                        <div
                          className={`m-0 rounded-md bg-white border border-gray-900 shadow-xl shadow-slate-200 cursor-grab overflow-hidden md:w-[200px] md:h-[200px] w-[100px] h-[100px] relative mt-1`}
                        >
                          <Image
                            src={item.image}
                            alt="item-image"
                            width={500}
                            height={500}
                            className="w-full h-full"
                          />
                          <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent  bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                          <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent  bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                            <input
                              type="checkbox"
                              checked={selectedItemsId?.includes(item.id)}
                              onChange={() => handleCheckboxChange(item)}
                              className="w-5 h-5 absolute right-3 top-3"
                            />
                          </div>
                        </div>
                      </GridItem>
                    ))}
                  </GridDropZone>
                )}
              </div>
              {/* ================third droppable Item zone ===========  */}
              {items.Images3.length > 0 && (
                <GridDropZone
                  id="Images3"
                  boxesPerRow={width > 1100 ? 4 : 2}
                  rowHeight={width > 600 ? 220 : 120}
                  className="h-[410px] w-full lg:ml-2 ml-0"
                >
                  {items.Images3.map((item: IItem, index: number) => (
                    <GridItem key={item.id}>
                      <div
                        className={`m-0 rounded-md bg-white border border-gray-900 shadow-xl shadow-slate-200 cursor-grab overflow-hidden md:w-[200px] md:h-[200px] w-[100px] h-[100px]`}
                      >
                        <Image
                          src={
                            item.image
                              ? item.image
                              : "https://img.freepik.com/premium-vector/photo-icon-picture-icon-image-sign-symbol-vector-illustration_64749-4409.jpg"
                          }
                          alt="item-image"
                          width={500}
                          height={500}
                          className="w-full h-full"
                        />
                        <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300"></div>
                        <div className="md:w-[200px] md:h-[200px] w-[100px] h-[100px] bg-transparent bg-zinc-600 bg-opacity-0 hover:bg-opacity-20 absolute top-0 left-0 duration-300">
                          <input
                            type="checkbox"
                            checked={selectedItemsId?.includes(item.id)}
                            onChange={() => handleCheckboxChange(item)}
                            className="w-5 h-5 absolute right-3 top-3"
                          />
                        </div>
                      </div>
                    </GridItem>
                  ))}
                </GridDropZone>
              )}
            </div>
          </GridContextProvider>

          {/* <button type="button" onClick={() => 
            State
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Page;
