"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Person, Course, Enrollment } from "../types"
import { pessoasAPI, type CreatePessoaDTO, type UpdatePessoaDTO } from "@/lib/api/pessoas"
import { cursosAPI, type CreateCursoDTO, type UpdateCursoDTO } from "@/lib/api/cursos"
import { inscricoesAPI, type CreateInscricaoDTO, type UpdateInscricaoDTO } from "@/lib/api/inscricoes"
import { APIError } from "@/lib/api/api-client"

interface DataContextType {
  people: Person[]
  courses: Course[]
  enrollments: Enrollment[]
  loading: boolean
  error: string | null
  addPerson: (person: CreatePessoaDTO) => Promise<Person>
  updatePerson: (id: number, person: UpdatePessoaDTO) => Promise<Person>
  deletePerson: (id: number) => Promise<void>
  addCourse: (course: CreateCursoDTO) => Promise<Course>
  updateCourse: (id: number, course: UpdateCursoDTO) => Promise<Course>
  deleteCourse: (id: number) => Promise<void>
  addEnrollment: (enrollment: CreateInscricaoDTO) => Promise<Enrollment>
  updateEnrollment: (id: number, enrollment: UpdateInscricaoDTO) => Promise<Enrollment>
  deleteEnrollment: (id: number) => Promise<void>
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("[v0] Fetching data from API...")

      const [peopleData, coursesData, enrollmentsData] = await Promise.all([
        pessoasAPI.getAll(),
        cursosAPI.getAll(),
        inscricoesAPI.getAll(),
      ])

      console.log("[v0] Data loaded successfully:", {
        people: peopleData.length,
        courses: coursesData.length,
        enrollments: enrollmentsData.length,
      })

      setPeople(peopleData)
      setCourses(coursesData)
      setEnrollments(enrollmentsData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)

      if (error instanceof APIError) {
        console.error("[v0] API Error:", error.message, error.statusCode)
        setError(error.message)

        if (error.statusCode === 0) {
          console.warn("[v0] Using empty data due to connection error")
          setPeople([])
          setCourses([])
          setEnrollments([])
        }
      } else {
        setError("Erro ao carregar dados")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const addPerson = async (person: CreatePessoaDTO): Promise<Person> => {
    const newPerson = await pessoasAPI.create(person)
    setPeople((prev) => [...prev, newPerson])
    return newPerson
  }

  const updatePerson = async (id: number, person: UpdatePessoaDTO): Promise<Person> => {
    const updatedPerson = await pessoasAPI.update(id, person)
    setPeople((prev) => prev.map((p) => (p.id === id ? updatedPerson : p)))
    return updatedPerson
  }

  const deletePerson = async (id: number): Promise<void> => {
    await pessoasAPI.delete(id)
    setPeople((prev) => prev.filter((p) => p.id !== id))
    setEnrollments((prev) => prev.filter((e) => e.pessoaId !== id))
  }

  const addCourse = async (course: CreateCursoDTO): Promise<Course> => {
    const newCourse = await cursosAPI.create(course)
    setCourses((prev) => [...prev, newCourse])
    return newCourse
  }

  const updateCourse = async (id: number, course: UpdateCursoDTO): Promise<Course> => {
    const updatedCourse = await cursosAPI.update(id, course)
    setCourses((prev) => prev.map((c) => (c.id === id ? updatedCourse : c)))
    return updatedCourse
  }

  const deleteCourse = async (id: number): Promise<void> => {
    await cursosAPI.delete(id)
    setCourses((prev) => prev.filter((c) => c.id !== id))
    setEnrollments((prev) => prev.filter((e) => e.cursoId !== id))
  }

  const addEnrollment = async (enrollment: CreateInscricaoDTO): Promise<Enrollment> => {
    const newEnrollment = await inscricoesAPI.create(enrollment)
    setEnrollments((prev) => [...prev, newEnrollment])
    return newEnrollment
  }

  const updateEnrollment = async (id: number, enrollment: UpdateInscricaoDTO): Promise<Enrollment> => {
    const updatedEnrollment = await inscricoesAPI.update(id, enrollment)
    setEnrollments((prev) => prev.map((e) => (e.id === id ? updatedEnrollment : e)))
    return updatedEnrollment
  }

  const deleteEnrollment = async (id: number): Promise<void> => {
    await inscricoesAPI.delete(id)
    setEnrollments((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        people,
        courses,
        enrollments,
        loading,
        error,
        addPerson,
        updatePerson,
        deletePerson,
        addCourse,
        updateCourse,
        deleteCourse,
        addEnrollment,
        updateEnrollment,
        deleteEnrollment,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
