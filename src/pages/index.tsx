import { type Video } from "@prisma/client";
import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";

const Home: NextPage = () => {
const [newTitle, setNewTitle] = useState("");
const [openAdd, setOpenAdd] = useState(false);
const [currentEdit, setCurrentEdit] = useState<Video | null>(null);
const allVideos = api.video.getAll.useQuery();
const createOneMutation = api.video.createOne.useMutation();
const updateOneMutation = api.video.updateOne.useMutation();
const deleteOneMutation = api.video.deleteOne.useMutation();

const handleAdd = async() => {
  await createOneMutation.mutateAsync({
    title: newTitle
  });
  void allVideos.refetch();
  setNewTitle("");
  setOpenAdd(false);
};

const handleEdit = async () => {
  if(!currentEdit) return;

  await updateOneMutation.mutateAsync({
    id: currentEdit.id,
    title: currentEdit.title,
    status: currentEdit.status,
    rentedBy: currentEdit.rentedBy,
    returnDate: currentEdit.returnDate
  });
  void allVideos.refetch();
  setCurrentEdit(null);
};

const handleDelete = async (video: Video) => {
  await deleteOneMutation.mutateAsync({ id: video.id });
  void allVideos.refetch();
};

return (
  <div>
    <Image
      src="/logo.png"
      alt="logo"
      width="150"
      height="150"
      priority
      style={{ width: "auto", height: "auto" }}
    />
    <div className="my-10 rounded-md bg-white px-7 py-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setOpenAdd(true);
            setCurrentEdit(null);
          }}
          className="flex items-center justify-center rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-200 active:bg-slate-300"
        >
          New
        </button>
      </div>
      <table className="mb-5 w-full">
        <thead>
          <tr>
            <th className="align-bottom">
              <div className="mx-3 flex items-center py-3 text-left text-xs font-semibold uppercase text-slate-400">
                Title
              </div>
            </th>
            <th className="align-bottom">
              <div className="mx-3 flex items-center py-3 text-left text-xs font-semibold uppercase text-slate-400">
                Status
              </div>
            </th>
            <th className="align-bottom">
              <div className="mx-3 flex items-center py-3 text-left text-xs font-semibold uppercase text-slate-400">
                Rented By
              </div>
            </th>
            <th className="align-bottom">
              <div className="mx-3 flex items-center py-3 text-left text-xs font-semibold uppercase text-slate-400">
                Return Date
              </div>
            </th>
            <th className="align-bottom">
              <div className="mx-3 flex items-center py-3 text-left text-xs font-semibold uppercase text-slate-400">
                {/* Actions */}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {allVideos.data?.map((video) => (
            <tr
              key={video.id}
              className="border-b-[1px] border-dashed border-slate-100 hover:bg-slate-50"
            >
              <td>
                <div className="mx-3 flex justify-start py-3 text-sm font-semibold text-slate-700">
                  {video.title}
                </div>
              </td>
              <td>
                <div className="mx-3 flex justify-start py-3 text-sm font-semibold text-slate-700">
                  {video.status}
                </div>
              </td>
              <td>
                <div className="mx-3 flex justify-start py-3 text-sm font-semibold text-slate-700">
                  {video.rentedBy || "-"}
                </div>
              </td>
              <td>
                <div className="mx-3 flex justify-start py-3 text-sm font-semibold text-slate-700">
                  {video.returnDate || "-"}
                </div>
              </td>
              <td>
                <div className="mx-3 flex justify-start py-3 text-sm font-semibold text-slate-700">
                  <button
                    onClick={() => {
                      setOpenAdd(false);
                      setCurrentEdit(video);
                    }}
                    className="mr-1 flex h-8 w-8 items-center justify-center  rounded-md hover:bg-slate-200 active:bg-slate-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {void handleDelete(video)}}
                    className="flex h-8 w-8 items-center justify-center  rounded-md hover:bg-slate-200 active:bg-slate-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Add */}
    {openAdd && (
      <div className="my-10 rounded-md bg-white px-7 py-6">
        Title:
        <input
          className="mx-2 rounded-none border-b-[1px] border-slate-300 py-[1px] pl-2 pr-3"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <div className="flex justify-end text-sm text-slate-600">
          <button
            onClick={() => setOpenAdd(false)}
            className="flex items-center justify-center rounded-md px-2  py-1 hover:bg-slate-200 active:bg-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {void handleAdd()}}
            className="flex items-center justify-center rounded-md px-2  py-1 hover:bg-slate-200 active:bg-slate-300"
          >
            Add
          </button>
        </div>
      </div>
    )}
    {/* Edit */}
    {currentEdit && (
      <div className="my-10 rounded-md bg-white px-7 py-6">
        <div>
          Title:
          <input
            className="mx-2 mb-2 rounded-none border-b-[1px] border-slate-300 py-[1px] pl-2 pr-3"
            value={currentEdit.title}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, title: e.target.value })
            }
          />
        </div>
        <div>
          Status:
          <input
            className="mx-2 mb-2 rounded-none border-b-[1px] border-slate-300 py-[1px] pl-2 pr-3"
            value={currentEdit.status}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, status: e.target.value })
            }
          />
        </div>
        <div>
          Rented By:
          <input
            className="mx-2 mb-2 rounded-none border-b-[1px] border-slate-300 py-[1px] pl-2 pr-3"
            value={currentEdit.rentedBy}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, rentedBy: e.target.value })
            }
          />
        </div>
        <div>
          Return Date:
          <input
            className="mx-2 mb-2 rounded-none border-b-[1px] border-slate-300 py-[1px] pl-2 pr-3"
            value={currentEdit.returnDate}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, returnDate: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end text-sm text-slate-600">
          <button
            onClick={() => setCurrentEdit(null)}
            className="flex items-center justify-center rounded-md px-2  py-1 hover:bg-slate-200 active:bg-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {void handleEdit()}}
            className="flex items-center justify-center rounded-md px-2  py-1 hover:bg-slate-200 active:bg-slate-300"
          >
            Save
          </button>
        </div>
      </div>
    )}
  </div>
);
}

export default Home;
